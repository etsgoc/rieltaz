-- Email notifications. Run after schema.sql.
-- 1. Deploy the function (see README, section "Emails").
-- 2. Replace YOUR_PROJECT_REF and YOUR_SECRET below, then run this file in the SQL editor.
-- If supabase_functions does not exist yet, open Database > Webhooks in the dashboard once and enable webhooks.

create trigger notify_reservations
  after insert or update on public.reservations
  for each row execute function supabase_functions.http_request(
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify', 'POST',
    '{"Content-Type":"application/json","x-webhook-secret":"YOUR_SECRET"}', '{}', '5000');

create trigger notify_service_orders
  after insert or update on public.service_orders
  for each row execute function supabase_functions.http_request(
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify', 'POST',
    '{"Content-Type":"application/json","x-webhook-secret":"YOUR_SECRET"}', '{}', '5000');

create trigger notify_messages
  after insert on public.messages
  for each row execute function supabase_functions.http_request(
    'https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify', 'POST',
    '{"Content-Type":"application/json","x-webhook-secret":"YOUR_SECRET"}', '{}', '5000');
