create table profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text, email text, phone text, nationality text,
  role text not null default 'client' check (role in ('client','admin')),
  created_at timestamptz default now()
);

create table reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  project_id text not null,
  unit_id text not null,
  ownership text not null check (ownership in ('leasehold','freehold')),
  quoted_price numeric(14,2) not null,
  stage text not null default 'requested'
    check (stage in ('requested','meeting_booked','documents','reservation_signed','fee_paid','contract_signed','closed','cancelled')),
  meeting_at timestamptz,
  meet_link text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index one_active_reservation_per_unit
  on reservations (project_id, unit_id)
  where stage <> 'cancelled';

create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  name text, email text, body text not null check (length(body) <= 2000),
  created_at timestamptz default now()
);

create function is_admin() returns boolean language sql stable security definer as
$$ select exists (select 1 from profiles where id = auth.uid() and role = 'admin') $$;

alter table profiles enable row level security;
alter table reservations enable row level security;
alter table messages enable row level security;

create policy "read profile" on profiles for select using (id = auth.uid() or is_admin());
create policy "edit own profile" on profiles for update using (id = auth.uid())
  with check (id = auth.uid() and role = 'client');
create policy "read reservations" on reservations for select using (user_id = auth.uid() or is_admin());
create policy "create reservation" on reservations for insert
  with check (user_id = auth.uid() and stage = 'requested');
create policy "admin updates" on reservations for update using (is_admin());
create policy "send message" on messages for insert with check (true);
create policy "admin reads messages" on messages for select using (is_admin());

create function touch() returns trigger language plpgsql as
$$ begin new.updated_at = now(); return new; end $$;
create trigger reservations_touch before update on reservations
  for each row execute function touch();

create function new_profile() returns trigger language plpgsql security definer as
$$ begin insert into profiles (id, email, full_name) values (new.id, new.email, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_signup after insert on auth.users
  for each row execute function new_profile();

create function taken_units() returns table (project_id text, unit_id text)
language sql stable security definer as
$$ select project_id, unit_id from reservations where stage <> 'cancelled' $$;

create function book_meeting(rid uuid, at timestamptz) returns void
language plpgsql security definer as
$$ begin
  update reservations set meeting_at = at, stage = 'meeting_booked'
  where id = rid and user_id = auth.uid() and stage in ('requested','meeting_booked');
  if not found then raise exception 'Reservation not found or already past the meeting step'; end if;
end $$;

create table payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations on delete cascade,
  label text not null,
  amount numeric(14,2) not null,
  position int not null,
  paid_at timestamptz
);
alter table payments enable row level security;
create policy "read payments" on payments for select using (
  is_admin() or exists (select 1 from reservations r where r.id = reservation_id and r.user_id = auth.uid()));
create policy "admin writes payments" on payments for all using (is_admin()) with check (is_admin());

create table service_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  service_id text not null,
  service_title text not null,
  option_label text,
  quantity int not null default 1,
  details jsonb not null default '{}',
  quoted_amount numeric(14,2),
  final_amount numeric(14,2),
  currency text not null default 'THB',
  status text not null default 'requested'
    check (status in ('requested','quoted','confirmed','paid','completed','cancelled')),
  ticket_code text unique,
  partner_id text,
  platform_fee numeric(14,2),
  partner_amount numeric(14,2),
  payment_ref text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table service_orders enable row level security;
create policy "read orders" on service_orders for select using (user_id = auth.uid() or is_admin());
create policy "create order" on service_orders for insert
  with check (user_id = auth.uid() and status = 'requested' and ticket_code is null and final_amount is null);
create policy "admin updates orders" on service_orders for update using (is_admin());

create function order_ticket() returns trigger language plpgsql as
$$ begin
  new.updated_at = now();
  if new.status in ('confirmed','paid','completed') and new.ticket_code is null then
    new.ticket_code = 'RT-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
  end if;
  return new;
end $$;
create trigger service_orders_ticket before update on service_orders
  for each row execute function order_ticket();
