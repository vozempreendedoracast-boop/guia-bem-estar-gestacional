
-- Fix ALL RLS policies: convert from RESTRICTIVE to PERMISSIVE
-- This is critical because RESTRICTIVE policies block all access when no PERMISSIVE policies exist

-- ===== ai_settings =====
DROP POLICY IF EXISTS "ai_settings_select" ON public.ai_settings;
DROP POLICY IF EXISTS "ai_settings_all_service" ON public.ai_settings;

CREATE POLICY "ai_settings_select" ON public.ai_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "ai_settings_all_service" ON public.ai_settings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== ai_usage =====
DROP POLICY IF EXISTS "ai_usage_select_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_insert_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_update_own" ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_all_service" ON public.ai_usage;

CREATE POLICY "ai_usage_select_own" ON public.ai_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "ai_usage_insert_own" ON public.ai_usage
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_usage_update_own" ON public.ai_usage
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "ai_usage_all_service" ON public.ai_usage
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== categories =====
DROP POLICY IF EXISTS "categories_select" ON public.categories;
DROP POLICY IF EXISTS "categories_all_service" ON public.categories;

CREATE POLICY "categories_select" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "categories_all_service" ON public.categories
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== exercises =====
DROP POLICY IF EXISTS "exercises_select" ON public.exercises;
DROP POLICY IF EXISTS "exercises_all_service" ON public.exercises;

CREATE POLICY "exercises_select" ON public.exercises
  FOR SELECT USING (true);

CREATE POLICY "exercises_all_service" ON public.exercises
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== health_tips =====
DROP POLICY IF EXISTS "health_tips_select" ON public.health_tips;
DROP POLICY IF EXISTS "health_tips_all_service" ON public.health_tips;

CREATE POLICY "health_tips_select" ON public.health_tips
  FOR SELECT USING (true);

CREATE POLICY "health_tips_all_service" ON public.health_tips
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== symptoms =====
DROP POLICY IF EXISTS "symptoms_select" ON public.symptoms;
DROP POLICY IF EXISTS "symptoms_all_service" ON public.symptoms;

CREATE POLICY "symptoms_select" ON public.symptoms
  FOR SELECT USING (true);

CREATE POLICY "symptoms_all_service" ON public.symptoms
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== user_profiles =====
DROP POLICY IF EXISTS "profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "profiles_all_service" ON public.user_profiles;

CREATE POLICY "profiles_select_own" ON public.user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "profiles_insert_own" ON public.user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles_update_own" ON public.user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "profiles_all_service" ON public.user_profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== user_roles =====
DROP POLICY IF EXISTS "roles_select_own" ON public.user_roles;
DROP POLICY IF EXISTS "roles_all_service" ON public.user_roles;

CREATE POLICY "roles_select_own" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "roles_all_service" ON public.user_roles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== week_contents =====
DROP POLICY IF EXISTS "week_contents_select" ON public.week_contents;
DROP POLICY IF EXISTS "week_contents_all_service" ON public.week_contents;

CREATE POLICY "week_contents_select" ON public.week_contents
  FOR SELECT USING (true);

CREATE POLICY "week_contents_all_service" ON public.week_contents
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ===== weekly_tips =====
DROP POLICY IF EXISTS "weekly_tips_select" ON public.weekly_tips;
DROP POLICY IF EXISTS "weekly_tips_all_service" ON public.weekly_tips;

CREATE POLICY "weekly_tips_select" ON public.weekly_tips
  FOR SELECT USING (true);

CREATE POLICY "weekly_tips_all_service" ON public.weekly_tips
  FOR ALL TO service_role USING (true) WITH CHECK (true);
