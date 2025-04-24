/*
  # Create tasks table with timer features

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `completed` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `due_date` (timestamptz)
      - `category` (text)
      - `priority` (text)
      - `timer_duration` (integer)
      - `timer_started_at` (timestamptz)
      - `timer_status` (text)
      - `work_session_duration` (integer)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    due_date TIMESTAMPTZ,
    category TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    timer_duration INTEGER,
    timer_started_at TIMESTAMPTZ,
    timer_status TEXT CHECK (timer_status IN ('not_started', 'running', 'paused', 'completed', 'failed')) DEFAULT 'not_started',
    work_session_duration INTEGER,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own tasks"
    ON tasks
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
    ON tasks
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON tasks
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON tasks
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);