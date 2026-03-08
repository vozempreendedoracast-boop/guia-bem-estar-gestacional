
-- Table to store FCM push tokens per user/device
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  fcm_token text NOT NULL,
  device_info text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, fcm_token)
);

-- RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "push_sub_select_own" ON public.push_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "push_sub_insert_own" ON public.push_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "push_sub_update_own" ON public.push_subscriptions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "push_sub_delete_own" ON public.push_subscriptions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Admin can read all (to send push to any user)
CREATE POLICY "push_sub_select_admin" ON public.push_subscriptions
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Revoke anon access
REVOKE ALL ON public.push_subscriptions FROM anon;

-- Updated_at trigger
CREATE TRIGGER push_subscriptions_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
