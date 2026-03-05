
-- =====================================================
-- FIX ALL RLS POLICIES: Drop RESTRICTIVE, recreate as PERMISSIVE
-- =====================================================

-- ========== ai_settings ==========
DROP POLICY IF EXISTS "ai_settings_admin_manage" ON public.ai_settings;
DROP POLICY IF EXISTS "ai_settings_all_service" ON public.ai_settings;
DROP POLICY IF EXISTS "ai_settings_select" ON public.ai_settings;
DROP POLICY IF EXISTS "ai_settings_select_permissive" ON public.ai_settings;

CREATE POLICY "ai_settings_select" ON public.ai_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "ai_settings_admin_manage" ON public.ai_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== ai_usage ==========
DROP POLICY IF EXISTS "ai_usage_all_service" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_insert_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_insert_own_permissive" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_select_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_select_own_permissive" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_update_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_update_own_permissive" ON public.ai_usage;

CREATE POLICY "ai_usage_select_own" ON public.ai_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ai_usage_insert_own" ON public.ai_usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_usage_update_own" ON public.ai_usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- ========== categories ==========
DROP POLICY IF EXISTS "categories_admin_manage" ON public.categories;
DROP POLICY IF EXISTS "categories_all_service" ON public.categories;
DROP POLICY IF EXISTS "categories_select" ON public.categories;
DROP POLICY IF EXISTS "categories_select_permissive" ON public.categories;

CREATE POLICY "categories_select" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "categories_admin_manage" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== exercises ==========
DROP POLICY IF EXISTS "exercises_admin_manage" ON public.exercises;
DROP POLICY IF EXISTS "exercises_admin_manage_permissive" ON public.exercises;
DROP POLICY IF EXISTS "exercises_all_service" ON public.exercises;
DROP POLICY IF EXISTS "exercises_select" ON public.exercises;
DROP POLICY IF EXISTS "exercises_select_permissive" ON public.exercises;

CREATE POLICY "exercises_select" ON public.exercises FOR SELECT TO authenticated USING (true);
CREATE POLICY "exercises_admin_manage" ON public.exercises FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== health_tips ==========
DROP POLICY IF EXISTS "health_tips_admin_manage" ON public.health_tips;
DROP POLICY IF EXISTS "health_tips_admin_manage_permissive" ON public.health_tips;
DROP POLICY IF EXISTS "health_tips_all_service" ON public.health_tips;
DROP POLICY IF EXISTS "health_tips_select" ON public.health_tips;
DROP POLICY IF EXISTS "health_tips_select_permissive" ON public.health_tips;

CREATE POLICY "health_tips_select" ON public.health_tips FOR SELECT TO authenticated USING (true);
CREATE POLICY "health_tips_admin_manage" ON public.health_tips FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== plans ==========
DROP POLICY IF EXISTS "plans_admin_manage" ON public.plans;
DROP POLICY IF EXISTS "plans_admin_manage_permissive" ON public.plans;
DROP POLICY IF EXISTS "plans_select" ON public.plans;
DROP POLICY IF EXISTS "plans_select_permissive" ON public.plans;

CREATE POLICY "plans_select" ON public.plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "plans_admin_manage" ON public.plans FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== pregnancy_profiles ==========
DROP POLICY IF EXISTS "pregnancy_profiles_admin_select" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_insert_own" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_insert_own_permissive" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_select_own" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_select_own_permissive" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_update_own" ON public.pregnancy_profiles;
DROP POLICY IF EXISTS "pregnancy_profiles_update_own_permissive" ON public.pregnancy_profiles;

CREATE POLICY "pregnancy_profiles_select_own" ON public.pregnancy_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "pregnancy_profiles_insert_own" ON public.pregnancy_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pregnancy_profiles_update_own" ON public.pregnancy_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "pregnancy_profiles_admin_select" ON public.pregnancy_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== promotions ==========
DROP POLICY IF EXISTS "promotions_admin_manage" ON public.promotions;
DROP POLICY IF EXISTS "promotions_admin_manage_permissive" ON public.promotions;
DROP POLICY IF EXISTS "promotions_select" ON public.promotions;
DROP POLICY IF EXISTS "promotions_select_permissive" ON public.promotions;

CREATE POLICY "promotions_select" ON public.promotions FOR SELECT TO authenticated USING (true);
CREATE POLICY "promotions_admin_manage" ON public.promotions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== reminders ==========
DROP POLICY IF EXISTS "reminders_delete_own" ON public.reminders;
DROP POLICY IF EXISTS "reminders_delete_own_permissive" ON public.reminders;
DROP POLICY IF EXISTS "reminders_insert_own" ON public.reminders;
DROP POLICY IF EXISTS "reminders_insert_own_permissive" ON public.reminders;
DROP POLICY IF EXISTS "reminders_select_own" ON public.reminders;
DROP POLICY IF EXISTS "reminders_select_own_permissive" ON public.reminders;
DROP POLICY IF EXISTS "reminders_update_own" ON public.reminders;
DROP POLICY IF EXISTS "reminders_update_own_permissive" ON public.reminders;

CREATE POLICY "reminders_select_own" ON public.reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reminders_insert_own" ON public.reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reminders_update_own" ON public.reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reminders_delete_own" ON public.reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ========== support_messages ==========
DROP POLICY IF EXISTS "support_insert_admin" ON public.support_messages;
DROP POLICY IF EXISTS "support_insert_admin_permissive" ON public.support_messages;
DROP POLICY IF EXISTS "support_insert_own" ON public.support_messages;
DROP POLICY IF EXISTS "support_insert_own_permissive" ON public.support_messages;
DROP POLICY IF EXISTS "support_select_admin" ON public.support_messages;
DROP POLICY IF EXISTS "support_select_admin_permissive" ON public.support_messages;
DROP POLICY IF EXISTS "support_select_own" ON public.support_messages;
DROP POLICY IF EXISTS "support_select_own_permissive" ON public.support_messages;
DROP POLICY IF EXISTS "support_update_admin" ON public.support_messages;
DROP POLICY IF EXISTS "support_update_admin_permissive" ON public.support_messages;

CREATE POLICY "support_select_own" ON public.support_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "support_select_admin" ON public.support_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_insert_own" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND sender = 'user');
CREATE POLICY "support_insert_admin" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_update_admin" ON public.support_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_delete_admin" ON public.support_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== symptoms ==========
DROP POLICY IF EXISTS "symptoms_admin_manage" ON public.symptoms;
DROP POLICY IF EXISTS "symptoms_admin_manage_permissive" ON public.symptoms;
DROP POLICY IF EXISTS "symptoms_all_service" ON public.symptoms;
DROP POLICY IF EXISTS "symptoms_select" ON public.symptoms;
DROP POLICY IF EXISTS "symptoms_select_permissive" ON public.symptoms;

CREATE POLICY "symptoms_select" ON public.symptoms FOR SELECT TO authenticated USING (true);
CREATE POLICY "symptoms_admin_manage" ON public.symptoms FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== user_profiles ==========
DROP POLICY IF EXISTS "profiles_admin_select" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_all_service" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_own_permissive" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_select_own_permissive" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_update_own_permissive" ON public.user_profiles;

CREATE POLICY "profiles_select_own" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_admin_select" ON public.user_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_admin_manage" ON public.user_profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== user_roles ==========
DROP POLICY IF EXISTS "roles_all_service" ON public.user_roles;
DROP POLICY IF EXISTS "roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "roles_select_own_permissive" ON public.user_roles;

CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ========== webhook_logs ==========
DROP POLICY IF EXISTS "webhook_logs_admin_select_permissive" ON public.webhook_logs;
DROP POLICY IF EXISTS "webhook_logs_all_service" ON public.webhook_logs;
DROP POLICY IF EXISTS "webhook_logs_select_admin" ON public.webhook_logs;

CREATE POLICY "webhook_logs_select_admin" ON public.webhook_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ========== week_contents ==========
DROP POLICY IF EXISTS "week_contents_admin_manage" ON public.week_contents;
DROP POLICY IF EXISTS "week_contents_all_service" ON public.week_contents;
DROP POLICY IF EXISTS "week_contents_select" ON public.week_contents;
DROP POLICY IF EXISTS "week_contents_select_permissive" ON public.week_contents;

CREATE POLICY "week_contents_select" ON public.week_contents FOR SELECT TO authenticated USING (true);
CREATE POLICY "week_contents_admin_manage" ON public.week_contents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ========== weekly_tips ==========
DROP POLICY IF EXISTS "weekly_tips_admin_manage" ON public.weekly_tips;
DROP POLICY IF EXISTS "weekly_tips_admin_manage_permissive" ON public.weekly_tips;
DROP POLICY IF EXISTS "weekly_tips_all_service" ON public.weekly_tips;
DROP POLICY IF EXISTS "weekly_tips_select" ON public.weekly_tips;
DROP POLICY IF EXISTS "weekly_tips_select_permissive" ON public.weekly_tips;

CREATE POLICY "weekly_tips_select" ON public.weekly_tips FOR SELECT TO authenticated USING (true);
CREATE POLICY "weekly_tips_admin_manage" ON public.weekly_tips FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
