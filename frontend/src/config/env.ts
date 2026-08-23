export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  MODE: import.meta.env.MODE || 'development',
};
