
-- Create table for AI assistant configuration
CREATE TABLE public.ai_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key_encrypted text NOT NULL DEFAULT '',
  provider text NOT NULL DEFAULT 'google',
  model text NOT NULL DEFAULT 'gemini-2.0-flash',
  system_prompt text NOT NULL DEFAULT 'Você é uma assistente carinhosa e acolhedora especializada em gestação. Responda com empatia, usando linguagem simples e acessível. NUNCA faça diagnósticos médicos. Sempre sugira que a gestante consulte seu médico para questões específicas de saúde.',
  temperature numeric NOT NULL DEFAULT 0.7,
  max_tokens integer NOT NULL DEFAULT 1024,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI settings publicly readable" ON public.ai_settings FOR SELECT USING (true);
CREATE POLICY "AI settings updatable" ON public.ai_settings FOR UPDATE USING (true);
CREATE POLICY "AI settings insertable" ON public.ai_settings FOR INSERT WITH CHECK (true);

-- Insert default row
INSERT INTO public.ai_settings (provider, model) VALUES ('google', 'gemini-2.0-flash');
