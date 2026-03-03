
-- ============================================
-- FIX: Convert ALL user-facing RLS policies from RESTRICTIVE to PERMISSIVE
-- Root cause: PostgreSQL requires at least one PERMISSIVE policy to grant access.
-- All current policies are RESTRICTIVE, meaning zero rows are ever returned.
-- ============================================

-- ======= user_profiles =======
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all profiles"
  ON public.user_profiles FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= user_roles =======
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role manages user_roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages user_roles"
  ON public.user_roles FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= ai_usage =======
DROP POLICY IF EXISTS "Users can view their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can insert their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can update their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Service role can manage all ai_usage" ON public.ai_usage;

CREATE POLICY "Users can view their own ai_usage"
  ON public.ai_usage FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ai_usage"
  ON public.ai_usage FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai_usage"
  ON public.ai_usage FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all ai_usage"
  ON public.ai_usage FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= ai_settings =======
DROP POLICY IF EXISTS "Service role manages ai_settings" ON public.ai_settings;

CREATE POLICY "Authenticated can read ai_settings"
  ON public.ai_settings FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Service role manages ai_settings"
  ON public.ai_settings FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= categories =======
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Service role writes categories" ON public.categories;

CREATE POLICY "Categories are publicly readable"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes categories"
  ON public.categories FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= exercises =======
DROP POLICY IF EXISTS "Exercises are publicly readable" ON public.exercises;
DROP POLICY IF EXISTS "Service role writes exercises" ON public.exercises;

CREATE POLICY "Exercises are publicly readable"
  ON public.exercises FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes exercises"
  ON public.exercises FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= health_tips =======
DROP POLICY IF EXISTS "Health tips are publicly readable" ON public.health_tips;
DROP POLICY IF EXISTS "Service role writes health_tips" ON public.health_tips;

CREATE POLICY "Health tips are publicly readable"
  ON public.health_tips FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes health_tips"
  ON public.health_tips FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= symptoms =======
DROP POLICY IF EXISTS "Symptoms are publicly readable" ON public.symptoms;
DROP POLICY IF EXISTS "Service role writes symptoms" ON public.symptoms;

CREATE POLICY "Symptoms are publicly readable"
  ON public.symptoms FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes symptoms"
  ON public.symptoms FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= week_contents =======
DROP POLICY IF EXISTS "Week contents are publicly readable" ON public.week_contents;
DROP POLICY IF EXISTS "Service role writes week_contents" ON public.week_contents;

CREATE POLICY "Week contents are publicly readable"
  ON public.week_contents FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes week_contents"
  ON public.week_contents FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ======= weekly_tips =======
DROP POLICY IF EXISTS "Weekly tips are publicly readable" ON public.weekly_tips;
DROP POLICY IF EXISTS "Service role writes weekly_tips" ON public.weekly_tips;

CREATE POLICY "Weekly tips are publicly readable"
  ON public.weekly_tips FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Service role writes weekly_tips"
  ON public.weekly_tips FOR ALL TO service_role
  USING (true) WITH CHECK (true);
