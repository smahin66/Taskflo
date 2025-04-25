import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 👇 Ajoute ceci pour exposer supabase dans la console navigateur
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.supabase = supabase;
}
