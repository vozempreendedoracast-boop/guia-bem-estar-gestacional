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

    const apiKey = settings?.api_key_encrypted || "";
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Nenhuma chave de API configurada. Adicione sua chave no painel admin." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let systemPrompt = settings?.system_prompt || "Você é uma assistente carinhosa especializada em gestação.";
    if (context?.name || context?.week) {
      systemPrompt += `\n\nContexto da gestante: nome "${context.name || 'não informado'}", semana ${context.week || '?'}, ${context.trimester || '?'}° trimestre.`;
    }

    const provider = settings?.provider || "google";
    const model = settings?.model || "gemini-2.0-flash";
    const temperature = settings?.temperature ?? 0.7;
    const maxTokens = settings?.max_tokens ?? 1024;
    const customBaseUrl = settings?.base_url || "";

    let apiUrl: string;
    let headers: Record<string, string>;
    let body: string;
    let responseFormat: "google" | "openai";

    if (provider === "google") {
      // Google Gemini native API
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      headers = { "Content-Type": "application/json" };
      responseFormat = "google";

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
    } else if (provider === "openai") {
      // OpenAI native API
      apiUrl = "https://api.openai.com/v1/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      responseFormat = "openai";
      body = JSON.stringify({
        model: model || "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    } else if (provider === "openrouter") {
      // OpenRouter API (OpenAI-compatible)
      apiUrl = "https://openrouter.ai/api/v1/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      responseFormat = "openai";
      body = JSON.stringify({
        model: model || "google/gemini-2.0-flash-exp:free",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    } else {
      // "custom" — qualquer API compatível com OpenAI
      if (!customBaseUrl) {
        return new Response(JSON.stringify({ error: "URL base da API não configurada. Preencha no painel admin." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      apiUrl = customBaseUrl.replace(/\/+$/, "") + "/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      responseFormat = "openai";
      body = JSON.stringify({
        model: model || "default",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature,
        max_tokens: maxTokens,
      });
    }

    console.log(`Chat request → provider: ${provider}, model: ${model}, url: ${apiUrl.split("?")[0]}`);

    const response = await fetch(apiUrl, { method: "POST", headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error (${provider}): ${response.status}`, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições excedido na sua API. Aguarde alguns instantes e tente novamente." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
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

    let assistantContent = "";
    if (responseFormat === "google") {
      assistantContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui gerar uma resposta.";
    } else {
      assistantContent = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";
    }

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
