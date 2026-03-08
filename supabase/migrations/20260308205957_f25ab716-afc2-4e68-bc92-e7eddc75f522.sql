
ALTER TABLE public.pregnancy_profiles
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS doctor_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS doctor_phone text NOT NULL DEFAULT '';
