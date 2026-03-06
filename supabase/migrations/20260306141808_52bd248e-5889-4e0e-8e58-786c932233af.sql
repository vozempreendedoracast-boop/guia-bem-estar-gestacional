
-- Phase 1: Add account_status to user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS account_status text NOT NULL DEFAULT 'active';

-- Phase 1: Add required_plan to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS required_plan text NOT NULL DEFAULT 'none';

-- Phase 1: Create support_conversations table
CREATE TABLE public.support_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'open',
  closed_by uuid,
  rating integer,
  rating_text text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  closed_at timestamp with time zone
);

ALTER TABLE public.support_conversations ENABLE ROW LEVEL SECURITY;

-- RLS for support_conversations
CREATE POLICY "support_conv_select_own" ON public.support_conversations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "support_conv_insert_own" ON public.support_conversations
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "support_conv_update_own" ON public.support_conversations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "support_conv_select_admin" ON public.support_conversations
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "support_conv_update_admin" ON public.support_conversations
  FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "support_conv_all_admin" ON public.support_conversations
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Phase 1: Add conversation_id and image_url to support_messages
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS conversation_id uuid REFERENCES public.support_conversations(id) ON DELETE CASCADE;
ALTER TABLE public.support_messages ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';

-- Phase 1: Create storage bucket for support images
INSERT INTO storage.buckets (id, name, public) VALUES ('support-images', 'support-images', true) ON CONFLICT DO NOTHING;

-- Storage RLS policies
CREATE POLICY "support_images_insert_auth" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'support-images');

CREATE POLICY "support_images_select_all" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'support-images');

CREATE POLICY "support_images_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'support-images' AND has_role(auth.uid(), 'admin'));
