import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qcifudejoljnzrdfmvie.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjaWZ1ZGVqb2xqbnpyZGZtdmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODEzNzIsImV4cCI6MjEwODA1NzM3Mn0.OFbuD7CsVfx0XbPjVpGmpiZzxP_tu20yXP6v1Jq2gu4";

export const supabase = createClient(supabaseUrl, supabaseKey);
