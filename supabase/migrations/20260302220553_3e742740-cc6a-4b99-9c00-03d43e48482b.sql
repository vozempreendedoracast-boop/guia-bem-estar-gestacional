
-- Allow all operations on categories (will be restricted to admin after auth is implemented)
CREATE POLICY "Allow insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Allow delete categories" ON public.categories FOR DELETE USING (true);

-- Allow all operations on exercises
CREATE POLICY "Allow insert exercises" ON public.exercises FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update exercises" ON public.exercises FOR UPDATE USING (true);
CREATE POLICY "Allow delete exercises" ON public.exercises FOR DELETE USING (true);

-- Allow all operations on health_tips
CREATE POLICY "Allow insert health_tips" ON public.health_tips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update health_tips" ON public.health_tips FOR UPDATE USING (true);
CREATE POLICY "Allow delete health_tips" ON public.health_tips FOR DELETE USING (true);

-- Allow all operations on symptoms
CREATE POLICY "Allow insert symptoms" ON public.symptoms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update symptoms" ON public.symptoms FOR UPDATE USING (true);
CREATE POLICY "Allow delete symptoms" ON public.symptoms FOR DELETE USING (true);

-- Allow all operations on week_contents
CREATE POLICY "Allow insert week_contents" ON public.week_contents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update week_contents" ON public.week_contents FOR UPDATE USING (true);
CREATE POLICY "Allow delete week_contents" ON public.week_contents FOR DELETE USING (true);

-- Allow all operations on weekly_tips
CREATE POLICY "Allow insert weekly_tips" ON public.weekly_tips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update weekly_tips" ON public.weekly_tips FOR UPDATE USING (true);
CREATE POLICY "Allow delete weekly_tips" ON public.weekly_tips FOR DELETE USING (true);
