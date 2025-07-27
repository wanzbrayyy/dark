import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iivlxfqjrcbmkvmucjfb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpdmx4ZnFqcmNibWt2bXVjamZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1OTExMTUsImV4cCI6MjA2OTE2NzExNX0.jkOrgisp_DT7ESSW4QhXzKj-nZKf4Dlg5E9IEBx28Ks'

export const supabase = createClient(supabaseUrl, supabaseKey)
