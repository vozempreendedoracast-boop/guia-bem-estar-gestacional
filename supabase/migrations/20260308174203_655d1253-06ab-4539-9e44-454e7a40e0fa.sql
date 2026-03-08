-- Allow public (anon) users to see active plans on sales page
CREATE POLICY "plans_select_anon"
ON public.plans
FOR SELECT
TO anon
USING (true);