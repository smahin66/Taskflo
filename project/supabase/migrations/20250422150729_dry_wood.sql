/*
  # Ajout des colonnes manquantes à la table tasks

  1. Nouvelles Colonnes
    - `timer_duration` (integer) : Durée du timer en minutes
    - `timer_started_at` (timestamptz) : Date et heure de démarrage du timer
    - `timer_status` (text) : Statut du timer (not_started, running, paused, completed, failed)
    - `work_session_duration` (integer) : Durée de la session de travail en minutes
    - `user_id` (uuid) : ID de l'utilisateur propriétaire de la tâche

  2. Contraintes
    - Contrainte CHECK sur timer_status pour valider les valeurs possibles
    - Clé étrangère sur user_id référençant la table auth.users

  3. Sécurité
    - Mise à jour des politiques RLS pour inclure les nouvelles colonnes
*/

-- Ajout des colonnes
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS timer_duration integer,
ADD COLUMN IF NOT EXISTS timer_started_at timestamptz,
ADD COLUMN IF NOT EXISTS timer_status text DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS work_session_duration integer,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ajout de la contrainte CHECK pour timer_status
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'tasks_timer_status_check'
  ) THEN
    ALTER TABLE tasks
    ADD CONSTRAINT tasks_timer_status_check
    CHECK (timer_status IN ('not_started', 'running', 'paused', 'completed', 'failed'));
  END IF;
END $$;

-- Activation de RLS si ce n'est pas déjà fait
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Suppression des anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

-- Création des nouvelles politiques RLS
CREATE POLICY "Users can create their own tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
ON tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
ON tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);