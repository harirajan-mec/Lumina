import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbrwigfnpkwfjnbomalk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNicndpZ2ZucGt3ZmpuYm9tYWxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjE0OTUsImV4cCI6MjA3OTM5NzQ5NX0.F8dH8Hy5SewHjEYUkZevdHXEkx7wzKSbh05Mg_lFWW0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
