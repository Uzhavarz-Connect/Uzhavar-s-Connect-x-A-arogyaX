import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qnmxexwiqsjllncdorpy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFubXhleHdpcXNqbGxuY2RvcnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzgxODUsImV4cCI6MjA1OTg1NDE4NX0.p39mWlKxlDdWhY5v7NSh1XkFPGI_TJgBn5jYhVit9y0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)