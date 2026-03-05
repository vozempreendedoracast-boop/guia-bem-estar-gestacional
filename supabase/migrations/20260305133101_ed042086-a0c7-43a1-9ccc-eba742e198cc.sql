
-- Add permissive admin policy for ai_settings management
CREATE POLICY "ai_settings_admin_manage"
ON public.ai_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add permissive select policy for ai_settings (needed for reads to work)
CREATE POLICY "ai_settings_select_permissive"
ON public.ai_settings
FOR SELECT
TO authenticated
USING (true);
