import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, context } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase
      .from("ai_settings")
      .select("*")
      .limit(1)
      .single();

    if (settings && !settings.enabled) {
      return new Response(JSON.stringify({ error: "A assistente de IA está desativada. Ative no painel admin." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const model = settings?.model || "google/gemini-2.5-flash-lite";
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.max_tokens ?? 1024;

    let systemPrompt = settings?.system_prompt || "Você é uma assistente carinhosa especializada em gestação.";
    if (context?.name || context?.week) {
      systemPrompt += `\n\nContexto da gestante: nome "${context.name || 'não informado'}", semana ${context.week || '?'}, ${context.trimester || '?'}° trimestre.`;
    }

    const openaiMessages = [{ role: "system", content: systemPrompt }, ...messages];

    // --- Try OpenRouter first ---
    const openrouterKey = settings?.api_key_encrypted || "";
    if (openrouterKey) {
      console.log(`Chat request → trying OpenRouter first, model: ${model}`);
      try {
        const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${openrouterKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: openaiMessages, temperature, max_tokens: maxTokens }),
        });

        if (orResponse.ok) {
          const data = await orResponse.json();
          const content = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
          return new Response(JSON.stringify({ content, provider: "openrouter" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const errorText = await orResponse.text();
        console.error(`OpenRouter failed (${orResponse.status}):`, errorText);

        // If auth error, don't fallback — it's a config issue
        if (orResponse.status === 401 || orResponse.status === 403) {
          return new Response(JSON.stringify({ error: "Chave OpenRouter inválida. Verifique no painel admin." }), {
            status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Rate limit or credits exhausted → fallback to Lovable IA
        console.log("OpenRouter unavailable, falling back to Lovable IA...");
      } catch (e) {
        console.error("OpenRouter network error:", e);
        console.log("Falling back to Lovable IA...");
      }
    }

    // --- Fallback: Lovable IA ---
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableKey) {
      return new Response(JSON.stringify({ error: "OpenRouter falhou e LOVABLE_API_KEY não está configurada como fallback." }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Chat request → using Lovable IA fallback, model: google/gemini-3-flash-preview");
    const lovResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: openaiMessages, temperature, max_tokens: maxTokens }),
    });

    if (!lovResponse.ok) {
      const errText = await lovResponse.text();
      console.error(`Lovable IA fallback failed (${lovResponse.status}):`, errText);

      if (lovResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido em ambos os provedores. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (lovResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes em ambos os provedores." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Erro no fallback Lovable IA (${lovResponse.status}).` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lovData = await lovResponse.json();
    const content = lovData.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    return new Response(JSON.stringify({ content, provider: "lovable (fallback)" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
