# JAG Air — Prettier UI + Images + Calendar

- Tailwind CSS styling
- Aircraft images (uses `aircraft.photo_url`, defaults to `/images/placeholder.png`)
- Calendar page at `/calendar` with colors per tail
- Aircraft detail at `/aircraft/[tail]`

## How to update
1) Upload all files (repo root) to GitHub.
2) In Supabase → SQL Editor: run `db/schema.sql` (adds `photo_url`), then `db/seed.sql` to set placeholders.
3) Vercel → Redeploy.

## Updating photos
- In Supabase → Table Editor → `aircraft` → set `photo_url` to a full image URL (e.g., a public link) or to `/images/placeholder.png`.
- You can also add your own files under `public/images/` and reference them like `/images/mytail.jpg`.
