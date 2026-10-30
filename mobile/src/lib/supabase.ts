import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

export const hasBackend = Boolean(SUPABASE_URL && SUPABASE_KEY);
export const db = createClient(SUPABASE_URL || 'http://localhost:54321', SUPABASE_KEY || 'public-anon-key', {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});
