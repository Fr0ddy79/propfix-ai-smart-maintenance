import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/authContext";
import { ProtectedRoute } from "@/components/app/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import { AppLayout } from "@/components/app/AppLayout";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import CalendarPage from "./pages/CalendarPage";
import Contractors from "./pages/Contractors";
import SettingsPage from "./pages/SettingsPage";
import TenantPortal from "./pages/TenantPortal";
import ContractorPortal from "./pages/ContractorPortal";

const queryClient = new QueryClient();

import { useQuery } from "@tanstack/react-query";
import { getTickets } from "./lib/data/queries";

const AnalyticsPage = () => {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
  });

  const completed = tickets.filter(t => t.status === "completed");
  const open = tickets.filter(t => t.status === "open");
  const inProgress = tickets.filter(t => t.status === "in_progress");
  const assigned = tickets.filter(t => t.status === "assigned");

  // Avg response: completed tickets with created_at → updated_at delta
  const avgResponse = (() => {
    const withData = completed.filter(t => t.created_at && t.updated_at);
    if (withData.length === 0) return null;
    const total = withData.reduce((sum, t) => {
      const created = new Date(t.created_at).getTime();
      const updated = new Date(t.updated_at).getTime();
      return sum + (updated - created) / (1000 * 60 * 60);
    }, 0);
    const avg = total / withData.length;
    return avg < 1 ? "<1h" : avg < 24 ? `${avg.toFixed(1)}h` : `${(avg / 24).toFixed(1)}d`;
  })();

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  tickets.forEach(t => {
    if (t.category) categoryMap[t.category] = (categoryMap[t.category] ?? 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxCatCount = categoryData[0]?.[1] ?? 1;

  const kpis = [
    { label: "Total Tickets", value: tickets.length, suffix: "" },
    { label: "Resolved", value: completed.length, suffix: "" },
    { label: "In Progress", value: inProgress.length + assigned.length, suffix: "" },
    { label: "Open", value: open.length, suffix: "" },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Performance overview</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Pro Plan</span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 card-shadow">
            <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
            <div className="text-2xl font-bold text-foreground tabular-nums">
              {isLoading ? "—" : `${kpi.value}${kpi.suffix}`}
            </div>
          </div>
        ))}
      </div>

      {/* Avg Response */}
      <div className="rounded-xl border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-foreground mb-1">Avg. Response Time</h3>
        <p className="text-xs text-muted-foreground mb-3">Time from ticket creation to first status update</p>
        <div className="text-3xl font-bold text-primary tabular-nums">
          {isLoading ? "—" : avgResponse ?? "—"}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{completed.length} resolved tickets</p>
      </div>

      {/* Category breakdown */}
      <div className="rounded-xl border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-foreground mb-4">Tickets by Category</h3>
        {categoryData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No ticket data yet.</p>
        ) : (
          <div className="space-y-3">
            {categoryData.map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="w-28 text-xs text-muted-foreground truncate">{cat}</div>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxCatCount) * 100}%` }}
                  />
                </div>
                <div className="w-8 text-xs text-muted-foreground text-right tabular-nums">{count}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolution rate */}
      <div className="rounded-xl border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-foreground mb-1">Completion Rate</h3>
        <p className="text-xs text-muted-foreground mb-3">Percentage of all tickets marked completed</p>
        <div className="text-3xl font-bold text-foreground tabular-nums">
          {isLoading || tickets.length === 0 ? "—" : `${Math.round((completed.length / tickets.length) * 100)}%`}
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/tenant" element={<TenantPortal />} />
            <Route path="/contractor" element={<ContractorPortal />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/:id" element={<TicketDetail />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="contractors" element={<Contractors />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
