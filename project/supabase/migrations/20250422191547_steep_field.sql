/*
  # Ajout des colonnes pour la fonctionnalité de timer

  1. Nouvelles Colonnes
    - `timerDuration` (integer) : Durée du timer en minutes
    - `timerStartedAt` (timestamptz) : Date et heure de démarrage du timer
    - `timerStatus` (text) : Statut du timer (not_started, running, paused, completed, failed)
    - `workSessionDuration` (integer) : Durée de la session de travail en minutes

  2. Modifications
    - Ajout des colonnes si elles n'existent pas
    - Vérification de l'existence de la contrainte avant de l'ajouter
*/

DO $$ 
BEGIN
  -- Ajouter timerDuration si n'existe pas
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'timerDuration'
  ) THEN
    ALTER TABLE tasks ADD COLUMN "timerDuration" integer;
  END IF;

  -- Ajouter timerStartedAt si n'existe pas
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'timerStartedAt'
  ) THEN
    ALTER TABLE tasks ADD COLUMN "timerStartedAt" timestamp with time zone;
  END IF;

  -- Ajouter timerStatus si n'existe pas
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'timerStatus'
  ) THEN
    ALTER TABLE tasks ADD COLUMN "timerStatus" text DEFAULT 'not_started';
  END IF;

  -- Ajouter la contrainte de vérification si elle n'existe pas
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'tasks'
    AND constraint_name = 'tasks_timer_status_check'
  ) THEN
    ALTER TABLE tasks ADD CONSTRAINT tasks_timer_status_check 
      CHECK (timer_status = ANY (ARRAY['not_started', 'running', 'paused', 'completed', 'failed']));
  END IF;

  -- Ajouter workSessionDuration si n'existe pas
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'tasks' 
    AND column_name = 'workSessionDuration'
  ) THEN
    ALTER TABLE tasks ADD COLUMN "workSessionDuration" integer;
  END IF;
END $$;