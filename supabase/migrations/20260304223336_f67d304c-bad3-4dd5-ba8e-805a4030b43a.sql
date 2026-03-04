-- Allow admin users to manage content tables from the client app
-- Uses security-definer function public.has_role(auth.uid(), 'admin')

DROP POLICY IF EXISTS "symptoms_admin_manage" ON public.symptoms;
CREATE POLICY "symptoms_admin_manage"
ON public.symptoms
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "exercises_admin_manage" ON public.exercises;
CREATE POLICY "exercises_admin_manage"
ON public.exercises
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "health_tips_admin_manage" ON public.health_tips;
CREATE POLICY "health_tips_admin_manage"
ON public.health_tips
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "weekly_tips_admin_manage" ON public.weekly_tips;
CREATE POLICY "weekly_tips_admin_manage"
ON public.weekly_tips
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));