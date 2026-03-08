import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Helper: base64url encode for Deno (handles UTF-8 properly)
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

function decodeBase64ToBytes(value: string): Uint8Array {
  // Strip everything that isn't a valid base64 character
  const cleaned = value.replace(/[^A-Za-z0-9+/]/g, "");
  const padding = cleaned.length % 4 === 0 ? "" : "=".repeat(4 - (cleaned.length % 4));
  const decoded = atob(cleaned + padding);
  return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
}

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
      // fall through
    }
  }

  // Accept full service-account JSON encoded as base64
  if (/^[A-Za-z0-9+/=_-]+$/.test(unquoted) && unquoted.length > 100) {
    try {
      const decoded = new TextDecoder().decode(decodeBase64ToBytes(unquoted));
      if (decoded.trim().startsWith("{")) {
        return JSON.parse(decoded) as ServiceAccountLike;
      }
    } catch {
      // fall through
    }
  }

  return { private_key: unquoted };
}

function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  return key
    .replace(/\\r/g, "")
    .replace(/\\\\n/g, "\\n")
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

  // Import private key
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

  // Exchange JWT for access token
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role
    const { data: hasAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!hasAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { target_user_id, title, body, url, self_test } = await req.json();

    if (!target_user_id || !title) {
      return new Response(JSON.stringify({ error: "target_user_id and title required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Allow users to send a test push to themselves without admin role
    const isSelfTest = self_test === true && target_user_id === user.id;

    if (!isSelfTest && !hasAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get FCM tokens for target user using service role
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: subscriptions } = await adminClient
      .from("push_subscriptions")
      .select("fcm_token")
      .eq("user_id", target_user_id);

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No tokens found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const accessToken = await getAccessToken();
    console.log("send-push: got access token, sending to", subscriptions.length, "device(s)");
    let sent = 0;
    const errors: string[] = [];

    for (const sub of subscriptions) {
      console.log("send-push: sending to token:", sub.fcm_token?.slice(0, 20) + "...");
      const fcmRes = await fetch(
        `https://fcm.googleapis.com/v1/projects/app-mamyboo/messages:send`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token: sub.fcm_token,
              notification: { title, body: body || "" },
              data: { url: url || "/painel" },
              webpush: {
                notification: {
                  icon: "/pwa-192.png",
                  badge: "/pwa-192.png",
                  tag: "mamyboo-push",
                },
                fcm_options: { link: url || "/painel" },
              },
            },
          }),
        }
      );

      const resText = await fcmRes.text();
      console.log("send-push: FCM response status:", fcmRes.status, "body:", resText.slice(0, 300));

      if (fcmRes.ok) {
        sent++;
      } else {
        errors.push(resText);
        // Remove invalid tokens
        if (resText.includes("UNREGISTERED") || resText.includes("NOT_FOUND")) {
          await adminClient
            .from("push_subscriptions")
            .delete()
            .eq("fcm_token", sub.fcm_token);
          console.log("send-push: removed invalid token");
        }
      }
    }

    return new Response(
      JSON.stringify({ sent, total: subscriptions.length, errors: errors.slice(0, 3) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-push error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
