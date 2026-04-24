import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://amkqiszftfsywxzutmrs.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFta3Fpc3pmdGZzeXd4enV0bXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NzgzMTAsImV4cCI6MjA5MjQ1NDMxMH0.DQXRCDEkfYeXLmS_hhY55sJOa-GTAzo2M8ljOU8L8MU"

export const supabase = createClient(supabaseUrl, supabaseKey)