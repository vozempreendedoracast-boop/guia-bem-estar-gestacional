import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const payload = await req.json();
    console.log("Kiwify webhook received:", JSON.stringify(payload, null, 2));

    // --- Detect payload format ---
    // Real Kiwify: has webhook_event_type, Customer.email, Product.product_name
    // Simulator (internal): has evento, email, produto, token
    const isRealKiwify = !!payload.webhook_event_type;

    let email: string;
    let evento: string;
    let produto: string;
    let token: string | undefined;

    if (isRealKiwify) {
      // Real Kiwify payload
      email = payload.Customer?.email || "";
      evento = payload.webhook_event_type || "";
      produto = payload.Product?.product_name || "";
      // Kiwify doesn't send token in body; check URL query params
      const url = new URL(req.url);
      token = url.searchParams.get("token") || undefined;
    } else {
      // Internal simulator payload
      email = payload.email || "";
      evento = payload.evento || "";
      produto = payload.produto || "";
      token = payload.token;
    }

    // Validate token
    const expectedToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN") || "";
    if (expectedToken && (!token || token !== expectedToken)) {
      console.error("Invalid or missing token");
      await logWebhook(supabase, email, evento, produto, "", "erro: token inválido");
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!email) {
      await logWebhook(supabase, "", evento, produto, "", "erro: email ausente");
      return new Response(JSON.stringify({ error: "Email obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedEvento = evento.toLowerCase().trim();
    const normalizedProduto = produto.toLowerCase().trim();

    // Map real Kiwify event types to internal events
    const eventMap: Record<string, string> = {
      "order_approved": "compra aprovada",
      "order_refunded": "reembolso",
      "subscription_canceled": "compra cancelada",
      "pix_created": "pix gerado",
      "order_chargedback": "chargeback",
    };
    const mappedEvento = eventMap[normalizedEvento] || normalizedEvento;

    console.log(`Processed: email=${normalizedEmail}, evento=${mappedEvento}, produto=${normalizedProduto}, isRealKiwify=${isRealKiwify}`);

    // Find user by email in user_profiles
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError) {
      console.error("Error finding user:", profileError);
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "erro: falha ao buscar usuário");
      return new Response(JSON.stringify({ error: "Erro interno" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!profile) {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "erro: usuário não encontrado");
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine action based on event
    if (mappedEvento === "compra aprovada") {
      let plan: "essential" | "premium" = "essential";
      if (normalizedProduto.includes("premium")) {
        plan = "premium";
      }

      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          plan,
          plan_status: "active",
          purchased_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("user_id", profile.user_id);

      if (updateError) {
        console.error("Error updating plan:", updateError);
        await logWebhook(supabase, normalizedEmail, mappedEvento, produto, plan, "erro: falha ao atualizar plano");
        return new Response(JSON.stringify({ error: "Erro ao atualizar plano" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, plan, "sucesso");
      console.log(`Plan activated: ${normalizedEmail} -> ${plan}`);

      return new Response(JSON.stringify({ ok: true, plan, status: "active" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (
      mappedEvento === "reembolso" ||
      mappedEvento === "chargeback" ||
      mappedEvento === "compra cancelada"
    ) {
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          plan: "none",
          plan_status: "none",
          expires_at: null,
        })
        .eq("user_id", profile.user_id);

      if (updateError) {
        console.error("Error revoking plan:", updateError);
        await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "none", "erro: falha ao revogar");
        return new Response(JSON.stringify({ error: "Erro ao revogar plano" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "none", "sucesso");
      console.log(`Plan revoked: ${normalizedEmail}`);

      return new Response(JSON.stringify({ ok: true, plan: "none", status: "revoked" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (mappedEvento === "pix gerado") {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "sucesso: pix gerado (apenas log)");
      console.log(`Pix gerado registrado: ${normalizedEmail}`);
      return new Response(JSON.stringify({ ok: true, message: "Pix gerado registrado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", `ignorado: evento "${evento}"`);
      return new Response(JSON.stringify({ ok: true, message: "Evento não processado" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (e) {
    console.error("Webhook error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function logWebhook(
  supabase: any,
  email: string,
  evento: string,
  produto: string,
  plano_aplicado: string,
  status_processamento: string
) {
  try {
    await supabase.from("webhook_logs").insert({
      email,
      evento,
      produto,
      plano_aplicado,
      status_processamento,
    });
  } catch (e) {
    console.error("Failed to log webhook:", e);
  }
}
