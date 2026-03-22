import { supabase, type Ticket, type Contractor, type Property, type Message, type Attachment, type Profile } from "@/lib/supabase";

// ─── Joined ticket view (what pages actually need) ────────────────────────────

export interface TicketRow {
  id: string;
  title: string;
  description: string;
  category: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled";
  property_id: string | null;
  tenant_id: string | null;
  contractor_id: string | null;
  scheduled_date: string | null;
  ai_triage_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // joined fields
  property_name?: string;
  property_address?: string;
  unit?: string;
  tenant_name?: string;
  tenant_email?: string;
  contractor_name?: string;
  contractor_company?: string;
  contractor_specialty?: string;
  contractor_phone?: string;
}

export interface ContractorRow {
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
  // joined from profiles
  full_name?: string;
  email?: string;
  phone?: string;
}

export interface CalendarEventRow {
  id: string;
  title: string;
  contractor_name: string;
  contractor_company: string;
  time: string;
  date: string;
  property_name: string;
  unit: string | null;
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
}

// ─── Tickets ─────────────────────────────────────────────────────────────────

export async function getTickets({
  status,
  search,
}: {
  status?: string;
  search?: string;
} = {}): Promise<TicketRow[]> {
  let query = supabase
    .from("tickets")
    .select(`
      *,
      property:properties(id, name, address),
      contractor:contractors(id, company_name, specialty)
    `)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    property_name: (t.property as Record<string, unknown> | null)?.name as string | undefined,
    property_address: (t.property as Record<string, unknown> | null)?.address as string | undefined,
    contractor_name: (t.contractor as Record<string, unknown> | null)?.company_name as string | undefined,
    contractor_specialty: (t.contractor as Record<string, unknown> | null)?.specialty as string | undefined,
  })) as TicketRow[];
}

export async function getTicketById(id: string): Promise<TicketRow | null> {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      property:properties(id, name, address),
      contractor:contractors(id, company_name, specialty, hourly_rate)
    `)
    .eq("id", id)
    .single();
  if (error) return null;

  const t = data as Record<string, unknown>;
  return {
    ...t,
    property_name: (t.property as Record<string, unknown> | null)?.name as string | undefined,
    property_address: (t.property as Record<string, unknown> | null)?.address as string | undefined,
    contractor_name: (t.contractor as Record<string, unknown> | null)?.company_name as string | undefined,
    contractor_company: (t.contractor as Record<string, unknown> | null)?.company_name as string | undefined,
    contractor_specialty: (t.contractor as Record<string, unknown> | null)?.specialty as string | undefined,
  } as TicketRow;
}

export async function createTicket(ticket: {
  title: string;
  description: string;
  category?: string;
  priority: "low" | "medium" | "high" | "urgent";
  property_id?: string;
  tenant_id?: string;
  unit?: string;
  scheduled_date?: string;
  ai_triage_json?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from("tickets")
    .insert({ ...ticket, status: "open" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function assignContractor(ticketId: string, contractorId: string) {
  const { data, error } = await supabase
    .from("tickets")
    .update({ contractor_id: contractorId, status: "assigned", updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTicketStatus(
  ticketId: string,
  status: "open" | "assigned" | "in_progress" | "completed" | "cancelled"
) {
  const { data, error } = await supabase
    .from("tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setTicketSchedule(ticketId: string, scheduledDate: string) {
  const { data, error } = await supabase
    .from("tickets")
    .update({ scheduled_date: scheduledDate || null, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function completeTicket(
  ticketId: string,
  completionNotes: string,
  photoUrls: { file_name: string; file_url: string; file_type: string }[]
) {
  // Update ticket status
  await supabase
    .from("tickets")
    .update({ status: "completed", updated_at: new Date().toISOString() })
    .eq("id", ticketId);

  // Add completion message
  await supabase.from("messages").insert({
    ticket_id: ticketId,
    content: `Job completed: ${completionNotes}`,
    is_system_message: false,
  });

  // Add photo attachments
  if (photoUrls.length > 0) {
    await supabase.from("attachments").insert(
      photoUrls.map((p) => ({ ticket_id: ticketId, ...p }))
    );
  }
}

// ─── Contractors ───────────────────────────────────────────────────────────────

export async function getContractors(): Promise<ContractorRow[]> {
  const { data, error } = await supabase
    .from("contractors")
    .select(`
      *,
      user:profiles(id, full_name, email, phone)
    `)
    .order("company_name");
  if (error) throw error;

  return (data ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    full_name: (c.user as Record<string, unknown> | null)?.full_name as string | undefined,
    email: (c.user as Record<string, unknown> | null)?.email as string | undefined,
    phone: (c.user as Record<string, unknown> | null)?.phone as string | undefined,
  })) as ContractorRow[];
}

export async function getContractorResponseSpeed(): Promise<Record<string, number>> {
  // Average hours from ticket creation to last update (proxy for response/handling speed)
  // For completed/in_progress tickets, updated_at approximates when work was done
  const { data, error } = await supabase
    .from("tickets")
    .select("contractor_id, updated_at, created_at")
    .in("status", ["in_progress", "completed"]);
  if (error) throw error;

  const responseTimes: Record<string, number[]> = {};
  for (const t of data ?? []) {
    if (!t.contractor_id) continue;
    const hours = (new Date(t.updated_at).getTime() - new Date(t.created_at).getTime()) / (1000 * 60 * 60);
    if (!responseTimes[t.contractor_id]) responseTimes[t.contractor_id] = [];
    responseTimes[t.contractor_id].push(hours);
  }

  const avgSpeed: Record<string, number> = {};
  for (const [id, hours] of Object.entries(responseTimes)) {
    avgSpeed[id] = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
  }
  return avgSpeed;
}

export async function getContractorActiveCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("tickets")
    .select("contractor_id")
    .in("status", ["assigned", "in_progress"]);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (row.contractor_id) {
      counts[row.contractor_id] = (counts[row.contractor_id] ?? 0) + 1;
    }
  }
  return counts;
}

export async function getContractorById(id: string): Promise<ContractorRow | null> {
  const { data, error } = await supabase
    .from("contractors")
    .select(`
      *,
      user:profiles(id, full_name, email, phone)
    `)
    .eq("id", id)
    .single();
  if (error) return null;
  const c = data as Record<string, unknown>;
  return {
    ...c,
    full_name: (c.user as Record<string, unknown> | null)?.full_name as string | undefined,
    email: (c.user as Record<string, unknown> | null)?.email as string | undefined,
    phone: (c.user as Record<string, unknown> | null)?.phone as string | undefined,
  } as ContractorRow;
}

export async function getContractorTickets(contractorId: string): Promise<TicketRow[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      *,
      property:properties(id, name, address),
      contractor:contractors(id, company_name, specialty)
    `)
    .eq("contractor_id", contractorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((t: Record<string, unknown>) => ({
    ...t,
    property_name: (t.property as Record<string, unknown> | null)?.name as string | undefined,
    property_address: (t.property as Record<string, unknown> | null)?.address as string | undefined,
    contractor_name: (t.contractor as Record<string, unknown> | null)?.company_name as string | undefined,
  })) as TicketRow[];
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

export async function getCalendarEvents(): Promise<CalendarEventRow[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(`
      id, title, scheduled_date, status, priority, unit,
      contractor:contractors(id, company_name),
      property:properties(id, name)
    `)
    .not("scheduled_date", "is", null)
    .not("status", "eq", "cancelled")
    .order("scheduled_date");
  if (error) throw error;

  return (data ?? []).map((t: Record<string, unknown>) => ({
    id: t.id as string,
    title: t.title as string,
    date: t.scheduled_date as string,
    contractor_name: (t.contractor as Record<string, unknown> | null)?.company_name as string ?? "Unassigned",
    contractor_company: (t.contractor as Record<string, unknown> | null)?.company_name as string ?? "",
    property_name: (t.property as Record<string, unknown> | null)?.name as string ?? "",
    unit: (t.unit as string | null) ?? null,
    status: (t.status as string) as CalendarEventRow["status"],
    priority: (t.priority as string) ?? "medium",
    time: "9:00 AM",
  })) as CalendarEventRow[];
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getMessages(ticketId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function addMessage(ticketId: string, content: string, senderId?: string) {
  const { data, error } = await supabase
    .from("messages")
    .insert({ ticket_id: ticketId, sender_id: senderId, content, is_system_message: false })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Properties ───────────────────────────────────────────────────────────────

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from("properties").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createProperty(property: {
  name: string;
  address: string;
  unit_count: number;
  manager_id?: string;
}) {
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...property, manager_id: property.manager_id ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("full_name");
  if (error) throw error;
  return data ?? [];
}

export async function createContractor(contractor: {
  company_name: string;
  specialty: string;
  email?: string;
  phone?: string;
  license_number?: string;
  insurance_info?: string;
  hourly_rate?: number;
  is_available?: boolean;
}) {
  const { data, error } = await supabase
    .from("contractors")
    .insert({ ...contractor, is_available: contractor.is_available ?? true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(id: string, updates: Partial<Pick<Profile, "full_name" | "phone">>) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [ticketsResult, calendarResult] = await Promise.all([
    supabase.from("tickets").select("status, priority, created_at, contractor_id"),
    getCalendarEvents(),
  ]);

  if (ticketsResult.error) throw ticketsResult.error;
  const tickets = ticketsResult.data ?? [];

  const today = new Date().toISOString().split("T")[0];
  const openCount = tickets.filter((t) => t.status === "open" || t.status === "assigned").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const completedCount = tickets.filter((t) => t.status === "completed").length;
  const unassignedCount = tickets.filter((t) => !t.contractor_id && t.status !== "completed").length;
  const overdueCount = tickets.filter((t) => {
    if (t.status === "completed" || t.status === "cancelled") return false;
    const created = new Date(t.created_at);
    const daysAgo = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo > 2;
  }).length;
  const todayJobs = calendarResult.filter((e) => e.date === today);

  return { openCount, inProgressCount, completedCount, unassignedCount, overdueCount, todayJobs, upcomingJobs: calendarResult.filter((e) => e.date > today).slice(0, 3) };
}
