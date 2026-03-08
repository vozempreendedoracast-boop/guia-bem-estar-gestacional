import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ── JWT / Access Token helpers (same as send-push) ──

function base64url(input: string): string {
  const bytes = new TextEncoder().encode(input);
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

function decodeBase64ToBytes(value: string): Uint8Array {
  const cleaned = value.replace(/[^A-Za-z0-9+/]/g, "");
  const padding = cleaned.length % 4 === 0 ? "" : "=".repeat(4 - (cleaned.length % 4));
  const decoded = atob(cleaned + padding);
  return Uint8Array.from(decoded, (c) => c.charCodeAt(0));
}

type SA = { client_email?: string; private_key?: string };

function parseServiceAccount(raw: string): SA {
  const trimmed = raw.trim();
  const unq = (trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ? trimmed.slice(1, -1) : trimmed;
  if (unq.startsWith("{")) { try { return JSON.parse(unq); } catch {} }
  if (/^[A-Za-z0-9+/=_-]+$/.test(unq) && unq.length > 100) {
    try { const d = new TextDecoder().decode(decodeBase64ToBytes(unq)); if (d.trim().startsWith("{")) return JSON.parse(d); } catch {}
  }
  return { private_key: unq };
}

function normalizeKey(raw: string): string {
  let k = raw.trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  return k.replace(/\\r/g, "").replace(/\\\\n/g, "\\n").replace(/\\n/g, "\n").replace(/\r/g, "").trim();
}

async function getAccessToken(): Promise<string> {
  const ceEnv = Deno.env.get("FCM_CLIENT_EMAIL") || "";
  const pkEnv = Deno.env.get("FCM_PRIVATE_KEY") || "";
  const fromPk = parseServiceAccount(pkEnv);
  const fromCe = parseServiceAccount(ceEnv);
  const email = fromCe.client_email || fromPk.client_email || ceEnv.trim();
  const pem = normalizeKey(fromPk.private_key || pkEnv);
  if (!email || !pem) throw new Error("FCM credentials missing");

  const now = Math.floor(Date.now() / 1000);
  const h = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const p = base64url(JSON.stringify({ iss: email, scope: "https://www.googleapis.com/auth/firebase.messaging", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const si = `${h}.${p}`;
  const pemBody = pem.replace(/-----BEGIN PRIVATE KEY-----/g, "").replace(/-----END PRIVATE KEY-----/g, "").replace(/\s/g, "");
  const key = await crypto.subtle.importKey("pkcs8", decodeBase64ToBytes(pemBody), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const sig = base64urlFromBuffer(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(si)));
  const jwt = `${si}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const d = await res.json();
  if (!d.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(d)}`);
  return d.access_token;
}

// ── Main handler ──

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: authHeader } } });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { title, body, url } = await req.json();
    if (!title) return new Response(JSON.stringify({ error: "title required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Get all subscribed users with their tokens
    const { data: subs } = await admin.from("push_subscriptions").select("user_id, fcm_token");
    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ sent: 0, users: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Deduplicate user_ids for inbox insertion
    const uniqueUserIds = [...new Set(subs.map(s => s.user_id))];

    // Insert inbox notifications for all users
    await admin.from("push_notifications").insert(
      uniqueUserIds.map(uid => ({ user_id: uid, title, body: body || "", url: url || "/painel" }))
    );

    // Send FCM to all tokens
    const accessToken = await getAccessToken();
    console.log(`send-push-mass: sending to ${subs.length} token(s) across ${uniqueUserIds.length} user(s)`);

    let sent = 0;
    const errors: string[] = [];

    for (const sub of subs) {
      try {
        const fcmRes = await fetch(`https://fcm.googleapis.com/v1/projects/app-mamyboo/messages:send`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            message: {
              token: sub.fcm_token,
              notification: { title, body: body || "" },
              data: { url: url || "/painel" },
              webpush: {
                notification: { icon: "/pwa-192.png", badge: "/pwa-192.png", tag: "mamyboo-push" },
                fcm_options: { link: url || "/painel" },
              },
            },
          }),
        });

        if (fcmRes.ok) {
          sent++;
        } else {
          const t = await fcmRes.text();
          errors.push(t.slice(0, 200));
          if (t.includes("UNREGISTERED") || t.includes("NOT_FOUND")) {
            await admin.from("push_subscriptions").delete().eq("fcm_token", sub.fcm_token);
          }
        }
      } catch (e: any) {
        errors.push(e.message?.slice(0, 100) || "unknown");
      }
    }

    return new Response(
      JSON.stringify({ sent, total: subs.length, users: uniqueUserIds.length, errors: errors.slice(0, 3) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("send-push-mass error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
