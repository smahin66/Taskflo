import { supabase } from './lib/supabase';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.supabase = supabase;
}
