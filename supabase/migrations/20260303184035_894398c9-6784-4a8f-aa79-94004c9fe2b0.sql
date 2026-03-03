
-- Assign admin role to vozempreendedoracast@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('6aa72da6-2b0c-4ec8-9577-d4db4469f24d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Activate premium plan for the admin user
UPDATE public.user_profiles
SET plan = 'premium',
    plan_status = 'active',
    purchased_at = now(),
    expires_at = now() + interval '10 years'
WHERE user_id = '6aa72da6-2b0c-4ec8-9577-d4db4469f24d';
