/*
# Create movies table (single-tenant, no auth)

1. New Tables
- `movies`
  - `id` (bigint, primary key, auto-increment)
  - `title` (text, not null)
  - `year` (int, not null)
  - `genre` (text, not null)
  - `director` (text, not null)
  - `cast` (text, not null) — column name is a reserved word, so it is quoted as "cast"
  - `plot` (text, not null)
  - `rating` (double precision, not null)
  - `duration` (int, not null, in minutes)
  - `poster_url` (text, not null)
  - `backdrop_url` (text, nullable)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `movies`.
- Allow anon + authenticated full CRUD because the data is intentionally public/shared (no sign-in screen).

3. Indexes
- Index on `genre` for genre filtering.
- Index on `rating` for sort-by-rating.
- Index on `year` for sort-by-year.
*/

CREATE TABLE IF NOT EXISTS movies (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title text NOT NULL,
  year int NOT NULL,
  genre text NOT NULL,
  director text NOT NULL,
  "cast" text NOT NULL,
  plot text NOT NULL,
  rating double precision NOT NULL,
  duration int NOT NULL,
  poster_url text NOT NULL,
  backdrop_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_movies" ON movies;
CREATE POLICY "anon_select_movies" ON movies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_movies" ON movies;
CREATE POLICY "anon_insert_movies" ON movies FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_movies" ON movies;
CREATE POLICY "anon_update_movies" ON movies FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_movies" ON movies;
CREATE POLICY "anon_delete_movies" ON movies FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_movies_genre ON movies (genre);
CREATE INDEX IF NOT EXISTS idx_movies_rating ON movies (rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies (year DESC);
