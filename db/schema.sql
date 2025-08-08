-- Core tables & helpers for JAG Air
create extension if not exists pgcrypto;

create table if not exists owners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone_e164 text,
  sms_opt_in boolean default true,
  notify_enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists aircraft (
  id uuid primary key default gen_random_uuid(),
  tail text unique not null,
  seats int not null,
  seat_sharing_enabled boolean not null default false,
  base_airport text not null,
  owner_pool text,
  created_at timestamptz default now()
);

create table if not exists ownerships (
  id uuid primary key default gen_random_uuid(),
  aircraft_id uuid references aircraft(id) on delete cascade,
  owner_id uuid references owners(id) on delete cascade,
  percentage numeric
);

create table if not exists owner_weeks (
  id uuid primary key default gen_random_uuid(),
  aircraft_id uuid references aircraft(id) on delete cascade,
  owner_id uuid references owners(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  recurs text
);

create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references owners(id) on delete set null,
  full_name text not null,
  dob date,
  passport_number text,
  passport_country text,
  visa_info text,
  created_at timestamptz default now()
);

create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  aircraft_id uuid references aircraft(id) on delete cascade,
  dep text not null,
  arr text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  whole_aircraft boolean not null default true,
  status text not null default 'REQUESTED',
  policy_snapshot jsonb default '{}'::jsonb,
  us_stay_address text,
  requested_by_owner_id uuid references owners(id),
  inside_min_notice boolean default false,
  priority_flag text default 'NONE',
  created_at timestamptz default now()
);

create table if not exists flight_seats (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid references flights(id) on delete cascade,
  owner_id uuid references owners(id) on delete cascade,
  seats_reserved int not null default 1
);

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text not null check (role in ('Manager','Owner')),
  owner_id uuid references owners(id)
);

-- Helper functions
create or replace function current_email() returns text language sql stable as $$
  select coalesce(nullif(auth.jwt()->>'email', ''), nullif(current_setting('request.jwt.claims', true)::json->>'email',''));
$$;

create or replace function is_manager() returns boolean language sql stable as $$
  select exists (select 1 from app_users au where au.email = current_email() and au.role = 'Manager');
$$;

create or replace function current_owner_id() returns uuid language sql stable as $$
  select owner_id from app_users where email = current_email();
$$;

create or replace function owner_id_for_email(e text) returns uuid language sql stable as $$
  select owner_id from app_users where email = e;
$$;

create or replace function week_owner_for_time(p_aircraft uuid, p_time timestamptz) returns uuid language sql stable as $$
  select ow.owner_id
  from owner_weeks ow
  where ow.aircraft_id = p_aircraft
    and p_time::date >= ow.week_start
    and p_time::date <= ow.week_end
  limit 1;
$$;

-- Priority trigger
create or replace function flights_before_insert() returns trigger language plpgsql as $$
declare
  req_email text;
  req_owner uuid;
  wk_owner uuid;
  hours_until numeric;
begin
  req_email := current_email();
  req_owner := owner_id_for_email(req_email);
  new.requested_by_owner_id := req_owner;

  hours_until := extract(epoch from (new.start_time - now()))/3600.0;
  new.inside_min_notice := (hours_until < 24);

  wk_owner := week_owner_for_time(new.aircraft_id, new.start_time);
  if wk_owner is not null and req_owner = wk_owner and hours_until >= 72 then
    new.priority_flag := 'WEEK_OWNER_PRIORITY';
  else
    new.priority_flag := 'NONE';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_flights_before_insert on flights;
create trigger trg_flights_before_insert before insert on flights for each row execute function flights_before_insert();

-- RLS policies
alter table owners enable row level security;
alter table aircraft enable row level security;
alter table ownerships enable row level security;
alter table flights enable row level security;
alter table flight_seats enable row level security;

drop policy if exists owners_read on owners;
create policy owners_read on owners for select using (is_manager() or id = current_owner_id());

drop policy if exists aircraft_read on aircraft;
create policy aircraft_read on aircraft for select using (
  is_manager() or exists (select 1 from ownerships o where o.aircraft_id = aircraft.id and o.owner_id = current_owner_id())
);

drop policy if exists ownerships_read on ownerships;
create policy ownerships_read on ownerships for select using (is_manager() or owner_id = current_owner_id());

drop policy if exists flights_read on flights;
create policy flights_read on flights for select using (
  is_manager() or exists (select 1 from ownerships o where o.aircraft_id = flights.aircraft_id and o.owner_id = current_owner_id())
);

drop policy if exists flights_insert on flights;
create policy flights_insert on flights for insert with check (
  is_manager() or exists (select 1 from ownerships o where o.aircraft_id = flights.aircraft_id and o.owner_id = current_owner_id())
);

drop policy if exists flights_update on flights;
create policy flights_update on flights for update using (is_manager());

drop policy if exists flights_delete on flights;
create policy flights_delete on flights for delete using (is_manager());

drop policy if exists flight_seats_read on flight_seats;
create policy flight_seats_read on flight_seats for select using (is_manager() or owner_id = current_owner_id());

drop policy if exists flight_seats_insert on flight_seats;
create policy flight_seats_insert on flight_seats for insert with check (is_manager() or owner_id = current_owner_id());
