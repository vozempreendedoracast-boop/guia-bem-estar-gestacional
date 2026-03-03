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

    const provider = settings?.provider || "lovable";
    const model = settings?.model || "google/gemini-3-flash-preview";
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.max_tokens ?? 1024;

    let systemPrompt = settings?.system_prompt || "Você é uma assistente carinhosa especializada em gestação.";
    if (context?.name || context?.week) {
      systemPrompt += `\n\nContexto da gestante: nome "${context.name || 'não informado'}", semana ${context.week || '?'}, ${context.trimester || '?'}° trimestre.`;
    }

    let apiUrl: string;
    let headers: Record<string, string>;
    let body: string;

    if (provider === "lovable") {
      // Lovable AI Gateway
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      if (!lovableKey) {
        return new Response(JSON.stringify({ error: "LOVABLE_API_KEY não configurada." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
      headers = { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" };
      body = JSON.stringify({
        model: model || "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    } else {
      // OpenRouter
      const apiKey = settings?.api_key_encrypted || "";
      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Nenhuma chave de API configurada. Adicione sua chave OpenRouter no painel admin." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      apiUrl = "https://openrouter.ai/api/v1/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      body = JSON.stringify({
        model: model || "google/gemini-2.5-flash-lite",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    }

    console.log(`Chat request → provider: ${provider}, model: ${model}, url: ${apiUrl}`);

    const response = await fetch(apiUrl, { method: "POST", headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${provider}): ${response.status}`, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Aguarde alguns instantes e tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 401 || response.status === 403) {
        return new Response(JSON.stringify({ error: "Chave de API inválida ou sem permissão. Verifique sua chave no painel admin." }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `Erro na API (${response.status}). Verifique sua chave e modelo configurados.` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const assistantContent = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    return new Response(JSON.stringify({ content: assistantContent, provider }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
