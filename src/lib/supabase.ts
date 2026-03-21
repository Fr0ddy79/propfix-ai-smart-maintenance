import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for the database tables
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'manager' | 'tenant' | 'contractor';
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  unit_count: number;
  manager_id: string;
  created_at: string;
  updated_at: string;
};

export type Contractor = {
  id: string;
  user_id: string | null;
  company_name: string;
  specialty: string;
  license_number: string | null;
  insurance_info: string | null;
  hourly_rate: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  property_id: string | null;
  tenant_id: string | null;
  contractor_id: string | null;
  scheduled_date: string | null;
  ai_triage_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  ticket_id: string;
  sender_id: string | null;
  content: string;
  is_system_message: boolean;
  created_at: string;
};

export type Attachment = {
  id: string;
  ticket_id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
};
