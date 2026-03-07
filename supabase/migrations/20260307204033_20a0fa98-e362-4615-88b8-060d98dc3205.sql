
-- 1. Allow users to update 'read' on their own support messages
CREATE POLICY "support_update_read_own"
ON public.support_messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Create mood_entries table for persistent mood tracking
CREATE TABLE public.mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "mood_entries_select_own" ON public.mood_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "mood_entries_insert_own" ON public.mood_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mood_entries_delete_own" ON public.mood_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_mood_entries_user_created ON public.mood_entries (user_id, created_at DESC);
