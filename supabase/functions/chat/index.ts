import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    // Get AI settings from DB
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings, error: settingsError } = await supabase
      .from("ai_settings")
      .select("*")
      .limit(1)
      .single();

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ error: "Configurações da IA não encontradas. Configure no painel admin." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!settings.enabled) {
      return new Response(JSON.stringify({ error: "A assistente de IA está desativada. Ative no painel admin." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!settings.api_key_encrypted) {
      return new Response(JSON.stringify({ error: "API Key não configurada. Insira a chave no painel admin." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = settings.api_key_encrypted;
    const provider = settings.provider;
    const model = settings.model;
    const systemPrompt = settings.system_prompt;
    const temperature = settings.temperature;
    const maxTokens = settings.max_tokens;

    let apiUrl: string;
    let body: any;
    let headers: Record<string, string>;

    if (provider === "google") {
      // Gemini API
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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
    } else {
      // OpenAI-compatible API
      apiUrl = provider === "openai" 
        ? "https://api.openai.com/v1/chat/completions"
        : `https://api.${provider}.com/v1/chat/completions`;
      
      headers = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };
      body = JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature,
        max_tokens: maxTokens,
      });
    }

    const response = await fetch(apiUrl, { method: "POST", headers, body });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `Erro na API de IA (${response.status}): ${errorText.substring(0, 200)}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    let assistantContent = "";
    if (provider === "google") {
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
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
