
-- Table for diary reminders (appointments, exams, etc.)
CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  reminder_date date NOT NULL,
  reminder_time time,
  category text NOT NULL DEFAULT 'consulta',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reminders_select_own" ON public.reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reminders_insert_own" ON public.reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reminders_update_own" ON public.reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reminders_delete_own" ON public.reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Table for support chat messages
CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  message text NOT NULL,
  sender text NOT NULL DEFAULT 'user',
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "support_select_own" ON public.support_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "support_insert_own" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND sender = 'user');
CREATE POLICY "support_select_admin" ON public.support_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_insert_admin" ON public.support_messages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "support_update_admin" ON public.support_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on reminders
CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
