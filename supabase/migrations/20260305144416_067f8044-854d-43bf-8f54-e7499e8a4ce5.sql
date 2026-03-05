
-- Fix RESTRICTIVE policies by adding PERMISSIVE admin policies

-- Categories: allow admin to manage (create/update/delete cards)
CREATE POLICY "categories_admin_manage"
ON public.categories FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories: permissive select for all authenticated
CREATE POLICY "categories_select_permissive"
ON public.categories FOR SELECT TO authenticated
USING (true);

-- Pregnancy profiles: allow admin to view all profiles
CREATE POLICY "pregnancy_profiles_admin_select"
ON public.pregnancy_profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Pregnancy profiles: permissive select own
CREATE POLICY "pregnancy_profiles_select_own_permissive"
ON public.pregnancy_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Pregnancy profiles: permissive insert own
CREATE POLICY "pregnancy_profiles_insert_own_permissive"
ON public.pregnancy_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Pregnancy profiles: permissive update own
CREATE POLICY "pregnancy_profiles_update_own_permissive"
ON public.pregnancy_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Promotions: permissive select for all
CREATE POLICY "promotions_select_permissive"
ON public.promotions FOR SELECT TO authenticated
USING (true);

-- Promotions: permissive admin manage
CREATE POLICY "promotions_admin_manage_permissive"
ON public.promotions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Support messages: permissive select own
CREATE POLICY "support_select_own_permissive"
ON public.support_messages FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Support messages: permissive insert own
CREATE POLICY "support_insert_own_permissive"
ON public.support_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND sender = 'user');

-- Support messages: permissive admin select
CREATE POLICY "support_select_admin_permissive"
ON public.support_messages FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Support messages: permissive admin insert
CREATE POLICY "support_insert_admin_permissive"
ON public.support_messages FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Support messages: permissive admin update
CREATE POLICY "support_update_admin_permissive"
ON public.support_messages FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User profiles: permissive admin select (for admin to see all users)
CREATE POLICY "profiles_admin_select"
ON public.user_profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User profiles: permissive select own
CREATE POLICY "profiles_select_own_permissive"
ON public.user_profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- User profiles: permissive insert own
CREATE POLICY "profiles_insert_own_permissive"
ON public.user_profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- User profiles: permissive update own
CREATE POLICY "profiles_update_own_permissive"
ON public.user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Plans: permissive select for all
CREATE POLICY "plans_select_permissive"
ON public.plans FOR SELECT TO authenticated
USING (true);

-- Plans: permissive admin manage
CREATE POLICY "plans_admin_manage_permissive"
ON public.plans FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Week contents: permissive select
CREATE POLICY "week_contents_select_permissive"
ON public.week_contents FOR SELECT TO authenticated
USING (true);

-- Week contents: permissive admin manage
CREATE POLICY "week_contents_admin_manage"
ON public.week_contents FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Symptoms: permissive select
CREATE POLICY "symptoms_select_permissive"
ON public.symptoms FOR SELECT TO authenticated
USING (true);

-- Symptoms: permissive admin manage
CREATE POLICY "symptoms_admin_manage_permissive"
ON public.symptoms FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Exercises: permissive select
CREATE POLICY "exercises_select_permissive"
ON public.exercises FOR SELECT TO authenticated
USING (true);

-- Exercises: permissive admin manage
CREATE POLICY "exercises_admin_manage_permissive"
ON public.exercises FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Health tips: permissive select
CREATE POLICY "health_tips_select_permissive"
ON public.health_tips FOR SELECT TO authenticated
USING (true);

-- Health tips: permissive admin manage
CREATE POLICY "health_tips_admin_manage_permissive"
ON public.health_tips FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Weekly tips: permissive select
CREATE POLICY "weekly_tips_select_permissive"
ON public.weekly_tips FOR SELECT TO authenticated
USING (true);

-- Weekly tips: permissive admin manage
CREATE POLICY "weekly_tips_admin_manage_permissive"
ON public.weekly_tips FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Reminders: permissive select own
CREATE POLICY "reminders_select_own_permissive"
ON public.reminders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Reminders: permissive insert own
CREATE POLICY "reminders_insert_own_permissive"
ON public.reminders FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Reminders: permissive update own
CREATE POLICY "reminders_update_own_permissive"
ON public.reminders FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- Reminders: permissive delete own
CREATE POLICY "reminders_delete_own_permissive"
ON public.reminders FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Webhook logs: permissive admin select
CREATE POLICY "webhook_logs_admin_select_permissive"
ON public.webhook_logs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- AI usage: permissive select own
CREATE POLICY "ai_usage_select_own_permissive"
ON public.ai_usage FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- AI usage: permissive insert own
CREATE POLICY "ai_usage_insert_own_permissive"
ON public.ai_usage FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- AI usage: permissive update own
CREATE POLICY "ai_usage_update_own_permissive"
ON public.ai_usage FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- User roles: permissive select own
CREATE POLICY "roles_select_own_permissive"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);
