import { createClient } from '@supabase/supabase-js';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://rgvfgjjssjiqsbdjcqyl.supabase.co';
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_tWiumKwlFjOEYqIl3mok_w_vsGEJPi3';

export const supabase = createClient(url, key);
