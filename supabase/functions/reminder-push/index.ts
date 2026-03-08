import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Helper: base64url encode for Deno
function base64url(input: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlFromBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

type ServiceAccountLike = {
  client_email?: string;
  private_key?: string;
};

function parseServiceAccountFromEnv(rawValue: string): ServiceAccountLike {
  const trimmed = rawValue.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1)
      : trimmed;

  if (unquoted.startsWith("{")) {
    try {
      return JSON.parse(unquoted) as ServiceAccountLike;
    } catch {
      // fall through and treat as plain key
    }
  }

  return { private_key: unquoted };
}

function decodeBase64ToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const decoded = atob(normalized + padding);
  return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
}

function normalizePrivateKey(rawKey: string): string {
  return rawKey
    .replace(/\\r/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .trim();
}

// Google OAuth2 token from service account
async function getAccessToken(): Promise<string> {
  const clientEmailEnv = Deno.env.get("FCM_CLIENT_EMAIL") || "";
  const privateKeyEnv = Deno.env.get("FCM_PRIVATE_KEY") || "";
  const parsedFromPrivateKey = parseServiceAccountFromEnv(privateKeyEnv);
  const parsedFromClientEmail = parseServiceAccountFromEnv(clientEmailEnv);

  const clientEmail =
    parsedFromClientEmail.client_email ||
    parsedFromPrivateKey.client_email ||
    clientEmailEnv.trim();

  const rawPrivateKey = parsedFromPrivateKey.private_key || privateKeyEnv;
  const privateKeyPem = normalizePrivateKey(rawPrivateKey);

  if (!clientEmail || !privateKeyPem) {
    throw new Error("FCM_CLIENT_EMAIL ou FCM_PRIVATE_KEY não configurados corretamente");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }));

  const signInput = `${header}.${payload}`;

  const pemContents = privateKeyPem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const binaryKey = decodeBase64ToBytes(pemContents);

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signInput)
  );

  const signature = base64urlFromBuffer(signatureBuffer);
  const jwt = `${signInput}.${signature}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`);
  }
  return tokenData.access_token;
}

async function sendPushToUser(accessToken: string, token: string, title: string, body: string, url: string) {
  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/app-mamyboo/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
          data: { url },
          webpush: {
            notification: { icon: "/pwa-192.png", badge: "/pwa-192.png", tag: "mamyboo-reminder" },
            fcm_options: { link: url },
          },
        },
      }),
    }
  );
  return res;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get today's date in ISO format
    const today = new Date().toISOString().split("T")[0];

    // Fetch reminders for today
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("id, user_id, title, category, reminder_time")
      .eq("reminder_date", today);

    if (error) throw error;
    if (!reminders || reminders.length === 0) {
      return new Response(JSON.stringify({ message: "No reminders for today", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const categoryLabels: Record<string, string> = {
      consulta: "📋 Consulta",
      exame: "🔬 Exame",
      ultrassom: "👶 Ultrassom",
      outro: "⏰ Lembrete",
    };

    // Get unique user_ids
    const userIds = [...new Set(reminders.map(r => r.user_id))];

    // Fetch all push tokens for these users
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("user_id, fcm_token")
      .in("user_id", userIds);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No push tokens for reminder users", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Group tokens by user
    const tokensByUser: Record<string, string[]> = {};
    for (const s of subscriptions) {
      if (!tokensByUser[s.user_id]) tokensByUser[s.user_id] = [];
      tokensByUser[s.user_id].push(s.fcm_token);
    }

    const accessToken = await getAccessToken();
    let totalSent = 0;

    for (const reminder of reminders) {
      const tokens = tokensByUser[reminder.user_id];
      if (!tokens) continue;

      const label = categoryLabels[reminder.category] || "⏰ Lembrete";
      const title = `${label} hoje!`;
      const body = reminder.title + (reminder.reminder_time ? ` às ${reminder.reminder_time.slice(0, 5)}` : "");

      for (const token of tokens) {
        try {
          const res = await sendPushToUser(accessToken, token, title, body, "/notificacoes");
          if (res.ok) {
            totalSent++;
          } else {
            const errText = await res.text();
            // Clean up invalid tokens
            if (errText.includes("UNREGISTERED") || errText.includes("NOT_FOUND")) {
              await supabase.from("push_subscriptions").delete().eq("fcm_token", token);
            }
          }
        } catch (e) {
          console.error("Push error:", e);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Done", reminders: reminders.length, sent: totalSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("reminder-push error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
