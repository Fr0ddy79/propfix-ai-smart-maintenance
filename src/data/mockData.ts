export type TicketStatus = "new" | "in-progress" | "completed" | "urgent";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  property: string;
  unit: string;
  tenant: string;
  tenantEmail: string;
  issueType: string;
  assignedContractor: string | null;
  contractorSpecialty: string;
  createdAt: string;
  updatedAt: string;
  aiSummary?: {
    category: string;
    suggestedTrade: string;
    urgency: string;
    estimatedCost: string;
  };
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  specialty: string;
  phone: string;
  email: string;
  availability: "available" | "busy" | "offline";
  activeJobs: number;
  completedJobs: number;
  avgResponseTime: string;
  rating: number;
}

export const tickets: Ticket[] = [
  {
    id: "TK-1042",
    title: "Leaking kitchen faucet",
    description: "The kitchen faucet has been dripping constantly for the past two days. Water is pooling under the sink and the cabinet base is getting damp. Tenant reports a musty smell starting to develop.",
    status: "urgent",
    priority: "high",
    property: "Riverside Apartments",
    unit: "Unit 4B",
    tenant: "Maria Santos",
    tenantEmail: "maria.santos@email.com",
    issueType: "Plumbing",
    assignedContractor: null,
    contractorSpecialty: "Plumbing",
    createdAt: "2026-03-19T08:30:00",
    updatedAt: "2026-03-19T08:30:00",
    aiSummary: {
      category: "Plumbing — Leak",
      suggestedTrade: "Licensed Plumber",
      urgency: "High — potential water damage",
      estimatedCost: "$150–$300",
    },
  },
  {
    id: "TK-1041",
    title: "AC not cooling properly",
    description: "Air conditioning unit is running but not producing cold air. Temperature in the apartment stays around 82°F even with AC set to 68°F.",
    status: "in-progress",
    priority: "high",
    property: "Oak Street Condos",
    unit: "Unit 12A",
    tenant: "James Chen",
    tenantEmail: "j.chen@email.com",
    issueType: "HVAC",
    assignedContractor: "Mike's HVAC Services",
    contractorSpecialty: "HVAC",
    createdAt: "2026-03-18T14:15:00",
    updatedAt: "2026-03-19T10:00:00",
    aiSummary: {
      category: "HVAC — Cooling Failure",
      suggestedTrade: "HVAC Technician",
      urgency: "High — comfort issue",
      estimatedCost: "$200–$500",
    },
  },
  {
    id: "TK-1040",
    title: "Electrical outlet not working",
    description: "Two outlets in the living room stopped working yesterday. Tenant has checked the breaker panel and nothing appears tripped.",
    status: "new",
    priority: "medium",
    property: "Maple Gardens",
    unit: "Unit 7C",
    tenant: "Sarah Kim",
    tenantEmail: "s.kim@email.com",
    issueType: "Electrical",
    assignedContractor: null,
    contractorSpecialty: "Electrical",
    createdAt: "2026-03-19T11:45:00",
    updatedAt: "2026-03-19T11:45:00",
    aiSummary: {
      category: "Electrical — Outlet Failure",
      suggestedTrade: "Licensed Electrician",
      urgency: "Medium — no safety hazard reported",
      estimatedCost: "$100–$200",
    },
  },
  {
    id: "TK-1039",
    title: "Lockout — tenant locked out",
    description: "Tenant is locked out of apartment. Key broke inside the lock mechanism. Needs emergency locksmith service.",
    status: "in-progress",
    priority: "urgent",
    property: "Riverside Apartments",
    unit: "Unit 2A",
    tenant: "David Park",
    tenantEmail: "d.park@email.com",
    issueType: "Locksmith",
    assignedContractor: "QuickKey Locksmith",
    contractorSpecialty: "Locksmith",
    createdAt: "2026-03-19T07:00:00",
    updatedAt: "2026-03-19T07:30:00",
    aiSummary: {
      category: "Access — Lockout",
      suggestedTrade: "Locksmith",
      urgency: "Urgent — tenant unable to access unit",
      estimatedCost: "$75–$150",
    },
  },
  {
    id: "TK-1038",
    title: "Dishwasher making loud noise",
    description: "Dishwasher started making a grinding noise during the wash cycle. Tenant says it still cleans dishes but the noise is concerning.",
    status: "new",
    priority: "low",
    property: "Oak Street Condos",
    unit: "Unit 5D",
    tenant: "Elena Rodriguez",
    tenantEmail: "e.rodriguez@email.com",
    issueType: "Appliance",
    assignedContractor: null,
    contractorSpecialty: "Appliance Repair",
    createdAt: "2026-03-18T16:20:00",
    updatedAt: "2026-03-18T16:20:00",
    aiSummary: {
      category: "Appliance — Dishwasher",
      suggestedTrade: "Appliance Technician",
      urgency: "Low — functional but noisy",
      estimatedCost: "$100–$250",
    },
  },
  {
    id: "TK-1037",
    title: "Bathroom ceiling water stain",
    description: "A brown water stain appeared on the bathroom ceiling. It seems to be growing slowly. No active dripping observed yet.",
    status: "new",
    priority: "medium",
    property: "Maple Gardens",
    unit: "Unit 3B",
    tenant: "Tom Harrison",
    tenantEmail: "t.harrison@email.com",
    issueType: "Plumbing",
    assignedContractor: null,
    contractorSpecialty: "Plumbing",
    createdAt: "2026-03-17T09:00:00",
    updatedAt: "2026-03-17T09:00:00",
  },
  {
    id: "TK-1036",
    title: "Window seal broken — draft coming in",
    description: "Bedroom window seal appears broken. Cold air drafts through even when window is fully closed.",
    status: "completed",
    priority: "medium",
    property: "Riverside Apartments",
    unit: "Unit 6C",
    tenant: "Lisa Wong",
    tenantEmail: "l.wong@email.com",
    issueType: "Windows",
    assignedContractor: "ClearView Glass",
    contractorSpecialty: "Glass & Windows",
    createdAt: "2026-03-14T10:00:00",
    updatedAt: "2026-03-16T15:00:00",
  },
  {
    id: "TK-1035",
    title: "Garage door opener malfunction",
    description: "Garage door opener remote stopped working. Batteries replaced but still no response. Manual operation works fine.",
    status: "completed",
    priority: "low",
    property: "Oak Street Condos",
    unit: "Unit 1A",
    tenant: "Robert Nakamura",
    tenantEmail: "r.nakamura@email.com",
    issueType: "General",
    assignedContractor: "All-Fix Handyman",
    contractorSpecialty: "General Maintenance",
    createdAt: "2026-03-12T11:30:00",
    updatedAt: "2026-03-15T09:00:00",
  },
];

export const contractors: Contractor[] = [
  {
    id: "C-001",
    name: "Mike Torres",
    company: "Mike's HVAC Services",
    specialty: "HVAC",
    phone: "(555) 234-5678",
    email: "mike@mikeshvac.com",
    availability: "busy",
    activeJobs: 2,
    completedJobs: 147,
    avgResponseTime: "1.2 hrs",
    rating: 4.8,
  },
  {
    id: "C-002",
    name: "Karen Liu",
    company: "QuickKey Locksmith",
    specialty: "Locksmith",
    phone: "(555) 345-6789",
    email: "karen@quickkey.com",
    availability: "available",
    activeJobs: 1,
    completedJobs: 89,
    avgResponseTime: "0.5 hrs",
    rating: 4.9,
  },
  {
    id: "C-003",
    name: "Dan Kowalski",
    company: "Kowalski Plumbing",
    specialty: "Plumbing",
    phone: "(555) 456-7890",
    email: "dan@kowalskiplumbing.com",
    availability: "available",
    activeJobs: 0,
    completedJobs: 213,
    avgResponseTime: "2.1 hrs",
    rating: 4.7,
  },
  {
    id: "C-004",
    name: "Angela Martinez",
    company: "Spark Electric Co.",
    specialty: "Electrical",
    phone: "(555) 567-8901",
    email: "angela@sparkelectric.com",
    availability: "available",
    activeJobs: 0,
    completedJobs: 176,
    avgResponseTime: "1.8 hrs",
    rating: 4.6,
  },
  {
    id: "C-005",
    name: "Ryan O'Brien",
    company: "ClearView Glass",
    specialty: "Glass & Windows",
    phone: "(555) 678-9012",
    email: "ryan@clearviewglass.com",
    availability: "offline",
    activeJobs: 0,
    completedJobs: 64,
    avgResponseTime: "3.4 hrs",
    rating: 4.5,
  },
  {
    id: "C-006",
    name: "Jeff Tanaka",
    company: "All-Fix Handyman",
    specialty: "General Maintenance",
    phone: "(555) 789-0123",
    email: "jeff@allfix.com",
    availability: "available",
    activeJobs: 1,
    completedJobs: 312,
    avgResponseTime: "1.5 hrs",
    rating: 4.8,
  },
];

// Generate dates relative to today so the calendar demo always shows the current week
const today = new Date();
const fmt = (d: Date) => d.toISOString().split("T")[0];
const dayStr = (offset: number) => fmt(new Date(today.getTime() + offset * 86400000));

export const calendarEvents = [
  { id: "1", title: "AC Repair — Unit 12A", contractor: "Mike Torres", time: "9:00 AM", date: dayStr(0), property: "Oak Street Condos", status: "in-progress" as TicketStatus },
  { id: "2", title: "Lockout — Unit 2A", contractor: "Karen Liu", time: "10:30 AM", date: dayStr(0), property: "Riverside Apartments", status: "in-progress" as TicketStatus },
  { id: "3", title: "Faucet Repair — Unit 4B", contractor: "Dan Kowalski", time: "2:00 PM", date: dayStr(0), property: "Riverside Apartments", status: "new" as TicketStatus },
  { id: "4", title: "Outlet Inspection — Unit 7C", contractor: "Angela Martinez", time: "9:00 AM", date: dayStr(1), property: "Maple Gardens", status: "new" as TicketStatus },
  { id: "5", title: "Dishwasher Service — Unit 5D", contractor: "Jeff Tanaka", time: "11:00 AM", date: dayStr(1), property: "Oak Street Condos", status: "new" as TicketStatus },
  { id: "6", title: "Ceiling Inspection — Unit 3B", contractor: "Dan Kowalski", time: "1:00 PM", date: dayStr(2), property: "Maple Gardens", status: "new" as TicketStatus },
  { id: "7", title: "Follow-up AC Check — Unit 12A", contractor: "Mike Torres", time: "3:00 PM", date: dayStr(3), property: "Oak Street Condos", status: "new" as TicketStatus },
];
