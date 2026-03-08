
-- Table to store push notifications history for the inbox/bell icon
CREATE TABLE public.push_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '/painel',
  read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

-- Users can see their own notifications
CREATE POLICY "push_notif_select_own" ON public.push_notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can update (mark as read) their own notifications
CREATE POLICY "push_notif_update_own" ON public.push_notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "push_notif_delete_own" ON public.push_notifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admin can do everything
CREATE POLICY "push_notif_admin_all" ON public.push_notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Service role inserts (from edge functions) bypass RLS automatically

-- Index for fast queries
CREATE INDEX idx_push_notifications_user_id ON public.push_notifications (user_id, created_at DESC);
CREATE INDEX idx_push_notifications_unread ON public.push_notifications (user_id, read) WHERE read = false;
