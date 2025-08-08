-- Add photo_url to aircraft if missing
alter table if exists aircraft add column if not exists photo_url text;

-- Passengers table (already present in earlier schema, but include here to be safe)
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

-- Link passengers to flights
create table if not exists flight_passengers (
  id uuid primary key default gen_random_uuid(),
  flight_id uuid references flights(id) on delete cascade,
  passenger_id uuid references passengers(id) on delete cascade
);
