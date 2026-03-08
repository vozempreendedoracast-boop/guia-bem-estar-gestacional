-- Garantir status padrão ativo para todas as contas
ALTER TABLE public.user_profiles
ALTER COLUMN plan_status SET DEFAULT 'active'::public.plan_status;

-- Normalizar histórico: qualquer conta com status 'none' vira 'active'
UPDATE public.user_profiles
SET plan_status = 'active'::public.plan_status
WHERE plan_status = 'none'::public.plan_status;