# JAG Air — Full App Setup

1) Supabase → SQL Editor → run `db/schema.sql`, then `db/seed.sql`.
2) Vercel → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon public key
3) Deploy. Test:
   - Login `/auth` with `jag1@jagair.mx`
   - Create a flight in `/flights/new` as `jarturoge@jagair.mx`
   - Approve in `/approvals` as Manager
