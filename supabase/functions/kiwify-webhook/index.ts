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
    const isRealKiwify = !!payload.webhook_event_type;

    let email: string;
    let evento: string;
    let produto: string;
    let token: string | undefined;
    let customerName: string | undefined;

    let subscriptionPlanName: string | undefined;
    let eventOccurredAt: string | undefined;

    if (isRealKiwify) {
      email = payload.Customer?.email || "";
      evento = payload.webhook_event_type || "";
      produto = payload.Product?.product_name || "";
      customerName = payload.Customer?.full_name || undefined;
      subscriptionPlanName = payload.Subscription?.plan?.name || undefined;
      eventOccurredAt = payload.refunded_at || payload.updated_at || payload.approved_date || payload.created_at || undefined;
      const url = new URL(req.url);
      token = url.searchParams.get("token") || undefined;
    } else {
      email = payload.email || "";
      evento = payload.evento || "";
      produto = payload.produto || "";
      token = payload.token;
      customerName = payload.nome || undefined;
      eventOccurredAt = payload.data_evento || undefined;
    }

    // Validate token
    const expectedToken = Deno.env.get("KIWIFY_WEBHOOK_TOKEN") || "";
    if (expectedToken && (!token || token !== expectedToken)) {
      console.error("Invalid or missing token");
      await logWebhook(supabase, email, evento, produto, "", "erro: token inválido");
      return jsonResponse({ error: "Não autorizado" }, 403);
    }

    if (!email) {
      await logWebhook(supabase, "", evento, produto, "", "erro: email ausente");
      return jsonResponse({ error: "Email obrigatório" }, 400);
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
      return jsonResponse({ error: "Erro interno" }, 500);
    }

    // --- AUTO-CREATE ACCOUNT if user not found and it's a purchase event ---
    let resolvedProfile = profile;

    if (!resolvedProfile && mappedEvento === "compra aprovada") {
      console.log(`User not found, auto-creating account for: ${normalizedEmail}`);

      try {
        // Use inviteUserByEmail to create account + send welcome email
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(normalizedEmail, {
          data: {
            full_name: customerName || "",
            invited_by: "kiwify_purchase",
          },
          redirectTo: "https://mamyboo.com/cadastro",
        });

        if (inviteError) {
          console.error("Error inviting user:", inviteError);
          
          // If user already exists in auth but not in profiles, try to find them
          if (inviteError.message?.includes("already been registered") || inviteError.message?.includes("already exists")) {
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
            if (!listError) {
              const existingUser = users?.find(u => u.email?.toLowerCase() === normalizedEmail);
              if (existingUser) {
                // Create profile for existing auth user
                const { data: newProfile, error: profileCreateError } = await supabase
                  .from("user_profiles")
                  .insert({ user_id: existingUser.id, email: normalizedEmail })
                  .select()
                  .single();

                if (!profileCreateError && newProfile) {
                  resolvedProfile = newProfile;
                  console.log(`Profile created for existing auth user: ${normalizedEmail}`);
                }
              }
            }
          }

          if (!resolvedProfile) {
            await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "erro: falha ao criar conta");
            return jsonResponse({ error: "Erro ao criar conta" }, 500);
          }
        } else if (inviteData?.user) {
          console.log(`Invite sent to ${normalizedEmail}, user created: ${inviteData.user.id}`);

          // Wait a moment for the trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Check if profile was auto-created by the trigger
          const { data: autoProfile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", inviteData.user.id)
            .maybeSingle();

          if (autoProfile) {
            resolvedProfile = autoProfile;
          } else {
            // Manually create profile if trigger didn't fire
            const { data: manualProfile, error: manualError } = await supabase
              .from("user_profiles")
              .insert({ user_id: inviteData.user.id, email: normalizedEmail })
              .select()
              .single();

            if (!manualError && manualProfile) {
              resolvedProfile = manualProfile;
            }
          }
        }
      } catch (createError) {
        console.error("Unexpected error creating account:", createError);
        await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "erro: falha inesperada ao criar conta");
        return jsonResponse({ error: "Erro ao criar conta" }, 500);
      }
    }

    if (!resolvedProfile) {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "erro: usuário não encontrado");
      return jsonResponse({ error: "Usuário não encontrado" }, 404);
    }

    // Determine action based on event
    if (mappedEvento === "compra aprovada") {
      return await handlePurchase(supabase, resolvedProfile, normalizedEmail, normalizedProduto, produto, subscriptionPlanName);
    } else if (["reembolso", "chargeback", "compra cancelada"].includes(mappedEvento)) {
      return await handleRevoke(supabase, resolvedProfile, normalizedEmail, mappedEvento, produto, eventOccurredAt);
    } else if (mappedEvento === "pix gerado") {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", "sucesso: pix gerado (apenas log)");
      return jsonResponse({ ok: true, message: "Pix gerado registrado" });
    } else {
      await logWebhook(supabase, normalizedEmail, mappedEvento, produto, "", `ignorado: evento "${evento}"`);
      return jsonResponse({ ok: true, message: "Evento não processado" });
    }

  } catch (e) {
    console.error("Webhook error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Erro desconhecido" }, 500);
  }
});

// --- Helper functions ---

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function handlePurchase(supabase: any, profile: any, email: string, normalizedProduto: string, produto: string, subscriptionPlanName?: string) {
  let plan: "essential" | "premium" = "essential";
  const subPlan = (subscriptionPlanName || "").toLowerCase();
  if (subPlan.includes("premium") || normalizedProduto.includes("premium")) {
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
    await logWebhook(supabase, email, "compra aprovada", produto, plan, "erro: falha ao atualizar plano");
    return jsonResponse({ error: "Erro ao atualizar plano" }, 500);
  }

  await logWebhook(supabase, email, "compra aprovada", produto, plan, "sucesso");
  console.log(`Plan activated: ${email} -> ${plan}`);
  return jsonResponse({ ok: true, plan, status: "active" });
}

async function handleRevoke(
  supabase: any,
  profile: any,
  email: string,
  evento: string,
  produto: string,
  eventOccurredAt?: string,
) {
  // Ignore stale revoke events that happened before a newer manual/admin purchase activation
  if (eventOccurredAt && profile?.purchased_at) {
    const eventDate = parseKiwifyDate(eventOccurredAt);
    const profilePurchasedAt = new Date(profile.purchased_at);

    if (eventDate && !Number.isNaN(profilePurchasedAt.getTime()) && eventDate < profilePurchasedAt) {
      await logWebhook(supabase, email, evento, produto, profile.plan || "none", "ignorado: evento antigo (stale)");
      console.log(`Revoke ignored (stale event): ${email}, event=${eventOccurredAt}, purchased_at=${profile.purchased_at}`);
      return jsonResponse({ ok: true, ignored: true, reason: "stale_revoke_event" });
    }
  }

  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({
      plan: "none",
      plan_status: "active",
      purchased_at: null,
      expires_at: null,
    })
    .eq("user_id", profile.user_id);

  if (updateError) {
    console.error("Error revoking plan:", updateError);
    await logWebhook(supabase, email, evento, produto, "none", "erro: falha ao revogar");
    return jsonResponse({ error: "Erro ao revogar plano" }, 500);
  }

  await logWebhook(supabase, email, evento, produto, "none", "sucesso");
  console.log(`Plan revoked: ${email}`);
  return jsonResponse({ ok: true, plan: "none", status: "revoked" });
}

function parseKiwifyDate(input?: string): Date | null {
  if (!input) return null;

  const normalized = input.includes("T") ? input : input.replace(" ", "T");
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

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
