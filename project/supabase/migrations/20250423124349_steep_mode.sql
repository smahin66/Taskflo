/*
  # Add blocked resources functionality

  1. New Tables
    - `blocked_resources`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `url` (text)
      - `name` (text)
      - `type` (text)
      - `created_at` (timestamptz)

  2. Changes to Tasks Table
    - Add `blocked_resources` column (text[])

  3. Security
    - Enable RLS on blocked_resources table
    - Add policies for authenticated users
*/

-- Create blocked_resources table
CREATE TABLE IF NOT EXISTS blocked_resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    url text NOT NULL,
    name text NOT NULL,
    type text CHECK (type IN ('website', 'application')) NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, url)
);

-- Add blocked_resources column to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS blocked_resources text[] DEFAULT '{}';

-- Enable RLS
ALTER TABLE blocked_resources ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own blocked resources"
    ON blocked_resources
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own blocked resources"
    ON blocked_resources
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own blocked resources"
    ON blocked_resources
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blocked resources"
    ON blocked_resources
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);