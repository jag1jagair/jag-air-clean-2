-- Add photo_url to aircraft if not exists
alter table if exists aircraft add column if not exists photo_url text;

-- (Run the previously provided full schema before this if your DB is fresh)
-- If you're starting fresh, you can also create the tables first, then run:
--   update aircraft set photo_url = '/images/placeholder.png';
