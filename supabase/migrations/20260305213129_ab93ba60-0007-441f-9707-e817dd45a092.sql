
-- Block anonymous (unauthenticated) access to all sensitive tables
-- by revoking anon SELECT where not needed

-- Revoke anon access from sensitive tables (anon role should not query these directly)
REVOKE ALL ON public.user_profiles FROM anon;
REVOKE ALL ON public.pregnancy_profiles FROM anon;
REVOKE ALL ON public.support_messages FROM anon;
REVOKE ALL ON public.webhook_logs FROM anon;
REVOKE ALL ON public.ai_settings FROM anon;
REVOKE ALL ON public.ai_usage FROM anon;
REVOKE ALL ON public.reminders FROM anon;
REVOKE ALL ON public.user_roles FROM anon;

-- Keep anon access for public-facing content tables (needed for unauthenticated pages like sales/plans)
-- categories, plans, symptoms, exercises, health_tips, week_contents, weekly_tips, promotions are OK for anon SELECT
