
-- =============================================
-- 1. DROP ALL EXISTING RESTRICTIVE POLICIES
-- =============================================

-- ai_settings
DROP POLICY IF EXISTS "Authenticated can read ai_settings" ON public.ai_settings;
DROP POLICY IF EXISTS "Service role manages ai_settings" ON public.ai_settings;

-- ai_usage
DROP POLICY IF EXISTS "Users can view their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can insert their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Users can update their own ai_usage" ON public.ai_usage;
DROP POLICY IF EXISTS "Service role can manage all ai_usage" ON public.ai_usage;

-- categories
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Service role writes categories" ON public.categories;

-- exercises
DROP POLICY IF EXISTS "Exercises are publicly readable" ON public.exercises;
DROP POLICY IF EXISTS "Service role writes exercises" ON public.exercises;

-- health_tips
DROP POLICY IF EXISTS "Health tips are publicly readable" ON public.health_tips;
DROP POLICY IF EXISTS "Service role writes health_tips" ON public.health_tips;

-- symptoms
DROP POLICY IF EXISTS "Symptoms are publicly readable" ON public.symptoms;
DROP POLICY IF EXISTS "Service role writes symptoms" ON public.symptoms;

-- user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.user_profiles;

-- user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Service role manages user_roles" ON public.user_roles;

-- week_contents
DROP POLICY IF EXISTS "Week contents are publicly readable" ON public.week_contents;
DROP POLICY IF EXISTS "Service role writes week_contents" ON public.week_contents;

-- weekly_tips
DROP POLICY IF EXISTS "Weekly tips are publicly readable" ON public.weekly_tips;
DROP POLICY IF EXISTS "Service role writes weekly_tips" ON public.weekly_tips;

-- =============================================
-- 2. RE-CREATE ALL AS PERMISSIVE
-- =============================================

-- ai_settings
CREATE POLICY "ai_settings_select" ON public.ai_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "ai_settings_all_service" ON public.ai_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ai_usage
CREATE POLICY "ai_usage_select_own" ON public.ai_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ai_usage_insert_own" ON public.ai_usage FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ai_usage_update_own" ON public.ai_usage FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "ai_usage_all_service" ON public.ai_usage FOR ALL TO service_role USING (true) WITH CHECK (true);

-- categories (public read)
CREATE POLICY "categories_select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_all_service" ON public.categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- exercises (public read)
CREATE POLICY "exercises_select" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "exercises_all_service" ON public.exercises FOR ALL TO service_role USING (true) WITH CHECK (true);

-- health_tips (public read)
CREATE POLICY "health_tips_select" ON public.health_tips FOR SELECT USING (true);
CREATE POLICY "health_tips_all_service" ON public.health_tips FOR ALL TO service_role USING (true) WITH CHECK (true);

-- symptoms (public read)
CREATE POLICY "symptoms_select" ON public.symptoms FOR SELECT USING (true);
CREATE POLICY "symptoms_all_service" ON public.symptoms FOR ALL TO service_role USING (true) WITH CHECK (true);

-- user_profiles
CREATE POLICY "profiles_select_own" ON public.user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_insert_own" ON public.user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "profiles_update_own" ON public.user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "profiles_all_service" ON public.user_profiles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- user_roles
CREATE POLICY "roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "roles_all_service" ON public.user_roles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- week_contents (public read)
CREATE POLICY "week_contents_select" ON public.week_contents FOR SELECT USING (true);
CREATE POLICY "week_contents_all_service" ON public.week_contents FOR ALL TO service_role USING (true) WITH CHECK (true);

-- weekly_tips (public read)
CREATE POLICY "weekly_tips_select" ON public.weekly_tips FOR SELECT USING (true);
CREATE POLICY "weekly_tips_all_service" ON public.weekly_tips FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================
-- 3. CREATE MISSING TRIGGER for auto profile creation
-- =============================================
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
