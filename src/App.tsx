import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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

const AnalyticsPlaceholder = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground">March 2026 overview</p>
      </div>
      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Pro Plan</span>
    </div>

    {/* KPI Row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: "Tickets Resolved", value: "47", change: "+12%" },
        { label: "Avg Resolution", value: "1.8d", change: "-0.3d" },
        { label: "Tenant Satisfaction", value: "4.8", change: "+0.2" },
        { label: "Cost This Month", value: "$2,340", change: "+8%" },
      ].map(kpi => (
        <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
          <div className="text-2xl font-bold text-foreground tabular-nums">{kpi.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{kpi.change} vs last month</div>
        </div>
      ))}
    </div>

    {/* Simple bar chart mockup */}
    <div className="rounded-xl border border-border bg-card p-5 card-shadow">
      <h3 className="text-sm font-semibold text-foreground mb-4">Tickets by Category</h3>
      <div className="space-y-3">
        {[
          { label: "Plumbing", value: 14, pct: 70 },
          { label: "HVAC", value: 11, pct: 55 },
          { label: "Electrical", value: 8, pct: 40 },
          { label: "Appliance", value: 6, pct: 30 },
          { label: "Locksmith", value: 4, pct: 20 },
        ].map(bar => (
          <div key={bar.label} className="flex items-center gap-3">
            <div className="w-20 text-xs text-muted-foreground">{bar.label}</div>
            <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/70 rounded-full transition-all duration-700"
                style={{ width: `${bar.pct}%` }}
              />
            </div>
            <div className="w-8 text-xs text-muted-foreground text-right">{bar.value}</div>
          </div>
        ))}
      </div>
    </div>

    <p className="text-xs text-muted-foreground text-center">Connect a real data source to enable live analytics on Professional and Enterprise plans.</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tenant" element={<TenantPortal />} />
          <Route path="/contractor" element={<ContractorPortal />} />
          <Route path="/app" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tickets" element={<Tickets />} />
            <Route path="tickets/:id" element={<TicketDetail />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="contractors" element={<Contractors />} />
            <Route path="analytics" element={<AnalyticsPlaceholder />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
