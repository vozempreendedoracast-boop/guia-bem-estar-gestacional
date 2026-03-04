
-- Create webhook_logs table
CREATE TABLE public.webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL DEFAULT '',
  evento text NOT NULL DEFAULT '',
  produto text NOT NULL DEFAULT '',
  plano_aplicado text NOT NULL DEFAULT '',
  status_processamento text NOT NULL DEFAULT 'sucesso',
  data_evento timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "webhook_logs_all_service"
  ON public.webhook_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated admins can read logs
CREATE POLICY "webhook_logs_select_admin"
  ON public.webhook_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
