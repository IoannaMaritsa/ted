// backend/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://deenohwgdmmzsnyvpnxz.supabase.co/'; 
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlZW5vaHdnZG1tenNueXZwbnh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNTM4MDUyNCwiZXhwIjoyMDQwOTU2NTI0fQ.E0C5A9KcOzFE1vBEQe0dJURPSo0l7PKZmna0VPUo_Yc'; // Replace with your Supabase service key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

module.exports = supabase;