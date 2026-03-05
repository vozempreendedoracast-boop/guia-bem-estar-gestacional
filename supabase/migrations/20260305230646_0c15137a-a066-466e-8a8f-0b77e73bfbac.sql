
-- Create page_blocks table for rich bio-link style content
CREATE TABLE public.page_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL DEFAULT 'text_rich',
  title TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_blocks ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "page_blocks_admin_manage" ON public.page_blocks
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Public read
CREATE POLICY "page_blocks_select" ON public.page_blocks
  FOR SELECT TO authenticated
  USING (true);

-- Updated_at trigger
CREATE TRIGGER update_page_blocks_updated_at
  BEFORE UPDATE ON public.page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
