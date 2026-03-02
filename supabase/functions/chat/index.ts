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

    let systemPrompt = settings?.system_prompt || "Você é uma assistente carinhosa especializada em gestação.";
    if (context?.name || context?.week) {
      systemPrompt += `\n\nContexto da gestante: nome "${context.name || 'não informado'}", semana ${context.week || '?'}, ${context.trimester || '?'}° trimestre.`;
    }

    const provider = settings?.provider || "lovable";
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.max_tokens ?? 1024;
    const customApiKey = settings?.api_key_encrypted || "";

    let apiUrl: string;
    let headers: Record<string, string>;
    let body: string;

    if (provider === "google" && customApiKey) {
      // Direct Google Gemini API
      const model = settings?.model || "gemini-2.0-flash";
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${customApiKey}`;
      headers = { "Content-Type": "application/json" };

      const contents = [];
      if (systemPrompt) {
        contents.push({ role: "user", parts: [{ text: systemPrompt }] });
        contents.push({ role: "model", parts: [{ text: "Entendido! Estou pronta para ajudar." }] });
      }
      for (const msg of messages) {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
      body = JSON.stringify({
        contents,
        generationConfig: { temperature, maxOutputTokens: maxTokens },
      });
    } else if (provider === "openai" && customApiKey) {
      // Direct OpenAI API
      const model = settings?.model || "gpt-4o";
      apiUrl = "https://api.openai.com/v1/chat/completions";
      headers = {
        Authorization: `Bearer ${customApiKey}`,
        "Content-Type": "application/json",
      };
      body = JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    } else {
      // Default: Lovable AI Gateway (no custom key needed)
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

      apiUrl = "https://ai.gateway.lovable.dev/v1/chat/completions";
      headers = {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      };
      body = JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
        stream: false,
      });
    }

    const response = await fetch(apiUrl, { method: "POST", headers, body });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI API error:", response.status, t);
      return new Response(JSON.stringify({ error: `Erro na API de IA (${response.status}). Verifique sua chave ou tente novamente.` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    let assistantContent = "";
    if (provider === "google" && customApiKey) {
      assistantContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui gerar uma resposta.";
    } else {
      assistantContent = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
    }

    return new Response(JSON.stringify({ content: assistantContent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
