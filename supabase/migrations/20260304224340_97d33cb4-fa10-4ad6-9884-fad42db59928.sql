
CREATE TABLE public.plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '0',
  price_label text NOT NULL DEFAULT 'pagamento único',
  badge text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BookOpen',
  features text[] NOT NULL DEFAULT '{}'::text[],
  excluded_features text[] NOT NULL DEFAULT '{}'::text[],
  checkout_url text NOT NULL DEFAULT '#',
  button_text text NOT NULL DEFAULT 'Quero começar',
  highlighted boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  highlight_text text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plans_select" ON public.plans FOR SELECT USING (true);

CREATE POLICY "plans_admin_manage" ON public.plans FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed the two existing plans
INSERT INTO public.plans (name, slug, description, price, price_label, icon, features, excluded_features, checkout_url, button_text, highlighted, display_order, highlight_text, badge) VALUES
(
  'Essencial',
  'essential',
  'Tudo para acompanhar sua gestação',
  'R$ 47',
  'pagamento único',
  'BookOpen',
  ARRAY['Acesso completo semana 1 a 42', 'Conteúdo de Saúde, Exercícios e Alimentação', 'Desenvolvimento do bebê semana a semana', 'Comparações de tamanho do bebê', 'Diário de humor e sintomas', 'Atualizações futuras incluídas', 'Acesso por 12 meses'],
  ARRAY['Assistente de IA'],
  '#',
  'Quero começar',
  false,
  0,
  '',
  ''
),
(
  'Premium',
  'premium',
  'A experiência completa',
  'R$ 97',
  'pagamento único',
  'Crown',
  ARRAY['Tudo do plano Essencial', 'Assistente de IA 24h', 'Respostas personalizadas', 'Uso ilimitado do chat IA', 'Recursos premium futuros', 'Suporte prioritário', 'Acesso por 12 meses'],
  '{}'::text[],
  '#',
  'Quero o Premium',
  true,
  1,
  'Economize com IA ilimitada inclusa',
  '⭐ Mais escolhido'
);
