import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or local storage override
const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const envAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('farm_connect_supabase_url') || '' : '';
const storedKey = typeof window !== 'undefined' ? localStorage.getItem('farm_connect_supabase_key') || '' : '';

export const supabaseUrl = storedUrl || envUrl;
export const supabaseAnonKey = storedKey || envAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') && 
  supabaseUrl.includes('.supabase.co')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Helper to update live credentials from the Database settings modal
 */
export function saveSupabaseConfig(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('farm_connect_supabase_url', url.trim());
    localStorage.setItem('farm_connect_supabase_key', key.trim());
    window.location.reload();
  }
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('farm_connect_supabase_url');
    localStorage.removeItem('farm_connect_supabase_key');
    window.location.reload();
  }
}
