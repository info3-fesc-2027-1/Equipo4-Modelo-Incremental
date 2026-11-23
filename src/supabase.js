const SUPABASE_URL = 'https://yzzkenopjopujyzcwhka.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emtlbm9wam9wdWp5emN3aGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMTQ2MjcsImV4cCI6MjEwODc5MDYyN30.mPDtJsWpLA60CetA90u4jUzSFPIqbwE6cJoF6dEWzeY';

const { createClient } = supabase;
export const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
