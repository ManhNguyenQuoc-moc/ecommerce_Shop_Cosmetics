import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// We use service role key here to allow the backend 
// to perform administrative tasks if needed, 
// and to verify tokens without being blocked by RLS.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
