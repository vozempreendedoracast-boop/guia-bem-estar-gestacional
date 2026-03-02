
-- Categories (dashboard cards)
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  path TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);

-- Week contents (linked to journey category)
CREATE TABLE public.week_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  week_number INT NOT NULL UNIQUE,
  baby_size TEXT NOT NULL DEFAULT '',
  baby_size_comparison TEXT NOT NULL DEFAULT '',
  baby_development TEXT NOT NULL DEFAULT '',
  mother_changes TEXT NOT NULL DEFAULT '',
  common_symptoms TEXT[] NOT NULL DEFAULT '{}',
  alerts TEXT[] NOT NULL DEFAULT '{}',
  tip TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','empty')),
  reviewed BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.week_contents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Week contents are publicly readable" ON public.week_contents FOR SELECT USING (true);

-- Symptoms
CREATE TABLE public.symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  when_common TEXT NOT NULL DEFAULT '',
  when_see_doctor TEXT NOT NULL DEFAULT '',
  what_to_do TEXT NOT NULL DEFAULT '',
  alert_level TEXT NOT NULL DEFAULT 'low' CHECK (alert_level IN ('low','moderate','high')),
  trimester INT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Symptoms are publicly readable" ON public.symptoms FOR SELECT USING (true);

-- Exercises
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  steps TEXT[] NOT NULL DEFAULT '{}',
  intensity TEXT NOT NULL DEFAULT 'Leve',
  contraindications TEXT NOT NULL DEFAULT 'Nenhuma',
  trimester INT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are publicly readable" ON public.exercises FOR SELECT USING (true);

-- Health tips (sections like Alimentação, Sono, etc.)
CREATE TABLE public.health_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  section_title TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '',
  tips TEXT[] NOT NULL DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.health_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Health tips are publicly readable" ON public.health_tips FOR SELECT USING (true);

-- Weekly tips (standalone tips tied to weeks)
CREATE TABLE public.weekly_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  week_number INT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_tips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Weekly tips are publicly readable" ON public.weekly_tips FOR SELECT USING (true);

-- Update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply update triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_week_contents_updated_at BEFORE UPDATE ON public.week_contents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_symptoms_updated_at BEFORE UPDATE ON public.symptoms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_health_tips_updated_at BEFORE UPDATE ON public.health_tips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_weekly_tips_updated_at BEFORE UPDATE ON public.weekly_tips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
