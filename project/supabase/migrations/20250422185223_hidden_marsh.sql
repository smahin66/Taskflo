/*
  # Fix due date column name

  1. Changes
    - Rename 'due_date' column to 'dueDate' in tasks table
    - Drop redundant 'due_data' column
  
  2. Notes
    - Uses safe column renaming approach
    - Preserves existing data
*/

DO $$ 
BEGIN
  -- Rename due_date to dueDate if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'due_date'
  ) THEN
    ALTER TABLE tasks RENAME COLUMN due_date TO "dueDate";
  END IF;

  -- Add dueDate column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'dueDate'
  ) THEN
    ALTER TABLE tasks ADD COLUMN "dueDate" timestamp with time zone;
  END IF;

  -- Drop redundant due_data column if it exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'due_data'
  ) THEN
    ALTER TABLE tasks DROP COLUMN due_data;
  END IF;
END $$;