CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed carousel defaults
INSERT INTO public.app_settings (key, value) VALUES
  ('promo_carousel_autoplay', 'true'),
  ('promo_carousel_interval', '5');

-- RLS: everyone can read, only admin can write
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings_select" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "app_settings_admin_manage" ON public.app_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));