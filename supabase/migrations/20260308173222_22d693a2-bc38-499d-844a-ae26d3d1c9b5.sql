
-- Schedule daily reminder push at 8:00 AM UTC (5:00 AM BRT)
SELECT cron.schedule(
  'daily-reminder-push',
  '0 8 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://hmtrjnosuwtmulerhgnr.supabase.co/functions/v1/reminder-push',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtdHJqbm9zdXd0bXVsZXJoZ25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NzUzMTgsImV4cCI6MjA4ODA1MTMxOH0.6RFt5sTFctWTxb5WTDdio9WjEtQxKsHNJHlL3GmYV8Y"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
