import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// HMAC SHA256 using Web Crypto API
async function hmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw", encoder.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Map Kiwify product IDs to plans
const PRODUCT_PLAN_MAP: Record<string, "essential" | "premium"> = {
  // These will be configured via env vars or hardcoded after Kiwify setup
  essential: "essential",
  premium: "premium",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("x-kiwify-signature") || req.headers.get("X-Kiwify-Signature") || "";

    // Validate webhook signature
    const webhookSecret = Deno.env.get("KIWIFY_WEBHOOK_SECRET");
    if (webhookSecret && signature) {
      const expectedSig = hmac("sha256", webhookSecret, body, "utf8", "hex");
      if (signature !== expectedSig) {
        console.error("Invalid webhook signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const payload = JSON.parse(body);
    console.log("Kiwify webhook received:", JSON.stringify(payload, null, 2));

    // Kiwify sends order_status
    const status = payload.order_status || payload.status;
    if (status !== "paid" && status !== "approved") {
      console.log(`Order status "${status}" — ignoring (not paid/approved)`);
      return new Response(JSON.stringify({ ok: true, message: "Status ignored" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract customer info
    const customer = payload.Customer || payload.customer || {};
    const email = (customer.email || payload.email || "").toLowerCase().trim();
    const orderId = payload.order_id || payload.OrderId || "";
    
    // Determine plan from product
    const product = payload.Product || payload.product || {};
    const productId = product.product_id || product.id || "";
    const productName = (product.product_name || product.name || "").toLowerCase();
    
    let plan: "essential" | "premium" = "essential";
    
    // Check env vars for product mapping
    const essentialProductId = Deno.env.get("KIWIFY_ESSENTIAL_PRODUCT_ID") || "";
    const premiumProductId = Deno.env.get("KIWIFY_PREMIUM_PRODUCT_ID") || "";
    
    if (premiumProductId && productId === premiumProductId) {
      plan = "premium";
    } else if (essentialProductId && productId === essentialProductId) {
      plan = "essential";
    } else if (productName.includes("premium")) {
      plan = "premium";
    } else if (productName.includes("essencial") || productName.includes("essential")) {
      plan = "essential";
    }
    // Fallback: check price
    const price = parseFloat(payload.Commissions?.charge_amount || payload.price || "0");
    if (price >= 90) plan = "premium";

    if (!email) {
      console.error("No email in webhook payload");
      return new Response(JSON.stringify({ error: "Missing customer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Processing: email=${email}, plan=${plan}, orderId=${orderId}`);

    // Init Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);

    let userId: string;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 12 months access

    if (existingUser) {
      userId = existingUser.id;
      console.log(`User already exists: ${userId}, updating plan to ${plan}`);

      // Update user_profiles
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          plan,
          plan_status: "active",
          kiwify_order_id: orderId,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
      }
    } else {
      // Create new user with random password (they'll use magic link)
      const tempPassword = crypto.randomUUID() + "!Aa1";
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
      });

      if (createError) {
        console.error("Error creating user:", createError);
        return new Response(JSON.stringify({ error: "Failed to create user" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      userId = newUser.user.id;
      console.log(`New user created: ${userId}`);

      // The trigger should create the profile, but let's ensure it's updated
      // Small delay for trigger to fire
      await new Promise(r => setTimeout(r, 1000));

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          plan,
          plan_status: "active",
          kiwify_order_id: orderId,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating new user profile:", updateError);
        // Try upsert as fallback
        await supabase.from("user_profiles").upsert({
          user_id: userId,
          email,
          plan,
          plan_status: "active",
          kiwify_order_id: orderId,
          purchased_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
        }, { onConflict: "user_id" });
      }
    }

    // Generate magic link for the user
    const siteUrl = Deno.env.get("SITE_URL") || "https://mamyboo.com";
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${siteUrl}/cadastro`,
      },
    });

    if (linkError) {
      console.error("Error generating magic link:", linkError);
    }

    const magicLink = linkData?.properties?.action_link || null;
    console.log(`Magic link generated: ${magicLink ? "yes" : "no"}`);

    return new Response(JSON.stringify({
      ok: true,
      userId,
      plan,
      magicLink,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
