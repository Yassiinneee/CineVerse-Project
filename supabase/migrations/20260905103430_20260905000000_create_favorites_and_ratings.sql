/*
# Create favorites and user_ratings tables

1. New Tables
- `favorites`
  - `id` (bigint, primary key, auto-increment)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `movie_id` (bigint, not null, references movies)
  - `created_at` (timestamptz, default now())
  - Unique constraint on (user_id, movie_id) to prevent duplicate favorites

- `user_ratings`
  - `id` (bigint, primary key, auto-increment)
  - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
  - `movie_id` (bigint, not null, references movies)
  - `rating` (int, not null, check 1-10)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
  - Unique constraint on (user_id, movie_id) — one rating per user per movie

2. Security
- Enable RLS on both tables.
- Owner-scoped CRUD: each authenticated user can only access their own rows.
- SELECT policies use auth.uid() = user_id.
- INSERT/UPDATE/DELETE policies check ownership.

3. Indexes
- Index on user_id for both tables (query favorites/ratings by user).
- Index on movie_id for user_ratings (aggregate ratings per movie).
*/ 

CREATE TABLE IF NOT EXISTS favorites (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id bigint NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_favorites" ON favorites;
CREATE POLICY "select_own_favorites" ON favorites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_favorites" ON favorites;
CREATE POLICY "insert_own_favorites" ON favorites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_favorites" ON favorites;
CREATE POLICY "delete_own_favorites" ON favorites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);

CREATE TABLE IF NOT EXISTS user_ratings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id bigint NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 10),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

ALTER TABLE user_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_ratings" ON user_ratings;
CREATE POLICY "select_own_ratings" ON user_ratings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_ratings" ON user_ratings;
CREATE POLICY "insert_own_ratings" ON user_ratings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_ratings" ON user_ratings;
CREATE POLICY "update_own_ratings" ON user_ratings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_ratings" ON user_ratings;
CREATE POLICY "delete_own_ratings" ON user_ratings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_ratings_user_id ON user_ratings (user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_movie_id ON user_ratings (movie_id);
