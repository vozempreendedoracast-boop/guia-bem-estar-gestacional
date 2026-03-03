
-- ============================================
-- FIX 1: ai_settings - remove public access, restrict to service_role
-- ============================================
DROP POLICY IF EXISTS "AI settings publicly readable" ON public.ai_settings;
DROP POLICY IF EXISTS "AI settings updatable" ON public.ai_settings;
DROP POLICY IF EXISTS "AI settings insertable" ON public.ai_settings;

CREATE POLICY "Service role manages ai_settings"
ON public.ai_settings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 2: categories - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow delete categories" ON public.categories;

CREATE POLICY "Service role writes categories"
ON public.categories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 3: week_contents - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert week_contents" ON public.week_contents;
DROP POLICY IF EXISTS "Allow update week_contents" ON public.week_contents;
DROP POLICY IF EXISTS "Allow delete week_contents" ON public.week_contents;

CREATE POLICY "Service role writes week_contents"
ON public.week_contents FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 4: symptoms - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert symptoms" ON public.symptoms;
DROP POLICY IF EXISTS "Allow update symptoms" ON public.symptoms;
DROP POLICY IF EXISTS "Allow delete symptoms" ON public.symptoms;

CREATE POLICY "Service role writes symptoms"
ON public.symptoms FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 5: exercises - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow update exercises" ON public.exercises;
DROP POLICY IF EXISTS "Allow delete exercises" ON public.exercises;

CREATE POLICY "Service role writes exercises"
ON public.exercises FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 6: health_tips - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert health_tips" ON public.health_tips;
DROP POLICY IF EXISTS "Allow update health_tips" ON public.health_tips;
DROP POLICY IF EXISTS "Allow delete health_tips" ON public.health_tips;

CREATE POLICY "Service role writes health_tips"
ON public.health_tips FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- FIX 7: weekly_tips - restrict write to service_role
-- ============================================
DROP POLICY IF EXISTS "Allow insert weekly_tips" ON public.weekly_tips;
DROP POLICY IF EXISTS "Allow update weekly_tips" ON public.weekly_tips;
DROP POLICY IF EXISTS "Allow delete weekly_tips" ON public.weekly_tips;

CREATE POLICY "Service role writes weekly_tips"
ON public.weekly_tips FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
