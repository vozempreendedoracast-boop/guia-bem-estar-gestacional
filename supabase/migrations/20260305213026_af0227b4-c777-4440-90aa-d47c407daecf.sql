
-- Fix ai_settings: remove public SELECT, only admin can read
DROP POLICY IF EXISTS "ai_settings_select" ON public.ai_settings;
DROP POLICY IF EXISTS "ai_settings_admin_manage" ON public.ai_settings;

-- Admin-only full access (includes SELECT)
CREATE POLICY "ai_settings_admin_all" ON public.ai_settings 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin')) 
WITH CHECK (public.has_role(auth.uid(), 'admin'));
