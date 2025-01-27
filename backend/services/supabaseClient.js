const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

module.exports = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // NOT anon key
  { auth: { persistSession: false } }
);
