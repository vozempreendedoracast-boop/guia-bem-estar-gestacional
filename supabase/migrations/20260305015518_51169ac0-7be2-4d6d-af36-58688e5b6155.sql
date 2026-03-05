
CREATE TABLE public.pregnancy_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  name text NOT NULL DEFAULT '',
  due_date date NOT NULL,
  last_period_date date,
  age integer NOT NULL DEFAULT 28,
  first_pregnancy boolean NOT NULL DEFAULT true,
  working boolean NOT NULL DEFAULT true,
  has_medical_care boolean NOT NULL DEFAULT true,
  current_symptoms text[] NOT NULL DEFAULT '{}',
  emotional_level integer NOT NULL DEFAULT 3,
  focus text NOT NULL DEFAULT 'both',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.pregnancy_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pregnancy_profiles_select_own" ON public.pregnancy_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pregnancy_profiles_insert_own" ON public.pregnancy_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pregnancy_profiles_update_own" ON public.pregnancy_profiles
  FOR UPDATE USING (auth.uid() = user_id);
