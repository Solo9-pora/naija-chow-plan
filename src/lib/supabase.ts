import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oazkscjuqsnzqrqtliop.supabase.co';
const supabaseAnonKey = 'sb_publishable_8jZYsBBzdn1nPuT9svAMqw_VctllMQW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);