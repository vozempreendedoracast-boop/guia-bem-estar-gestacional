const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const clientEmail = Deno.env.get("FCM_CLIENT_EMAIL") || "(empty)";
  const privateKey = Deno.env.get("FCM_PRIVATE_KEY") || "(empty)";

  const info = {
    clientEmail: {
      length: clientEmail.length,
      first30: clientEmail.slice(0, 30),
      last20: clientEmail.slice(-20),
      containsAt: clientEmail.includes("@"),
    },
    privateKey: {
      length: privateKey.length,
      first50: privateKey.slice(0, 50),
      last30: privateKey.slice(-30),
      containsBeginHeader: privateKey.includes("-----BEGIN"),
      containsEndHeader: privateKey.includes("-----END"),
      containsLiteralBackslashN: privateKey.includes("\\n"),
      containsNewline: privateKey.includes("\n"),
      containsOpenBrace: privateKey.startsWith("{"),
    },
  };

  return new Response(JSON.stringify(info, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
