// supabase-client.js
import { createClient } from '@supabase/supabase-js';

// Supabase URL aur Anon Key
const SUPABASE_URL = 'https://jsxeaidujprtnuaatipw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzeGVhaWR1anBydG51YWF0aXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTAzODMsImV4cCI6MjA3NTM4NjM4M30.UVtbbtKagINyH3aHmaXatkXbs6ijt7TECEEIcCYL5ao';

// Supabase client create karo
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
