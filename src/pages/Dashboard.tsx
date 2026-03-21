import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, ArrowRight, Plus, Calendar as CalendarIcon, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/app/StatusBadge";
import { getTickets, getCalendarEvents } from "@/lib/data/queries";

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export default function Dashboard() {
  const { data: allTickets = [], isLoading: ticketsLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
  });

  const { data: calendarEvents = [], isLoading: calendarLoading } = useQuery({
    queryKey: ["calendar-events"],
    queryFn: getCalendarEvents,
  });

  const today = new Date().toISOString().split("T")[0];

  const overdue = allTickets.filter(t => {
    if (t.status === "completed" || t.status === "cancelled") return false;
    const created = new Date(t.created_at);
    const daysAgo = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));
    return daysAgo > 2;
  });

  const unassigned = allTickets
    .filter(t => !t.contractor_id && t.status !== "completed" && t.status !== "cancelled")
    .sort((a, b) => {
      if (a.priority === "urgent" && b.priority !== "urgent") return -1;
      if (b.priority === "urgent" && a.priority !== "urgent") return 1;
      return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3);
    });

  const todayJobs = calendarEvents.filter(e => e.date === today);
  const upcomingJobs = calendarEvents.filter(e => e.date > today).slice(0, 3);

  const openCount = allTickets.filter(t => t.status === "open" || t.status === "assigned").length;
  const inProgressCount = allTickets.filter(t => t.status === "in_progress").length;
  const completedCount = allTickets.filter(t => t.status === "completed").length;
  const unassignedCount = unassigned.length;

  const isLoading = ticketsLoading || calendarLoading;

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Alerts */}
      <div className="flex flex-wrap gap-2">
        {overdue.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-destructive font-semibold">{overdue.length} overdue ticket{overdue.length > 1 ? "s" : ""}</span>
          </div>
        )}
        {unassigned.some(t => t.priority === "urgent") && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-status-urgent/10 border border-status-urgent/20 text-sm">
            <Flame className="w-4 h-4 text-status-urgent" />
            <span className="text-status-urgent font-semibold">Urgent needs attention</span>
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-status-in-progress/8 border border-status-in-progress/15 text-sm">
          <Clock className="w-4 h-4 text-status-in-progress" />
          <span className="text-status-in-progress font-medium">{unassignedCount} unassigned request{unassignedCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/app/tickets?status=open" className="rounded-xl border border-border bg-card p-4 card-shadow hover:card-shadow-hover transition-shadow group cursor-pointer">
          <div className="text-xs text-muted-foreground mb-1">Open Tickets</div>
          <div className="text-2xl font-bold tabular-nums text-status-new">{isLoading ? "—" : openCount}</div>
          <div className="text-xs text-muted-foreground mt-1">{unassignedCount} unassigned</div>
        </Link>
        <Link to="/app/tickets?status=in_progress" className="rounded-xl border border-border bg-card p-4 card-shadow hover:card-shadow-hover transition-shadow group cursor-pointer">
          <div className="text-xs text-muted-foreground mb-1">In Progress</div>
          <div className="text-2xl font-bold tabular-nums text-status-in-progress">{isLoading ? "—" : inProgressCount}</div>
          <div className="text-xs text-muted-foreground mt-1">{overdue.length} overdue</div>
        </Link>
        <Link to="/app/tickets?status=completed" className="rounded-xl border border-border bg-card p-4 card-shadow hover:card-shadow-hover transition-shadow group cursor-pointer">
          <div className="text-xs text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl font-bold tabular-nums text-status-completed">{isLoading ? "—" : completedCount}</div>
          <div className="text-xs text-muted-foreground mt-1">total in system</div>
        </Link>
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="text-xs text-muted-foreground mb-1">Avg Response</div>
          <div className="text-2xl font-bold tabular-nums text-primary">1.4h</div>
          <div className="text-xs text-muted-foreground mt-1">↓ 0.3h this week</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,320px] gap-6">
        {/* Action Required */}
        <div className="rounded-xl border border-border bg-card card-shadow">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Action Required</h2>
            <Link to="/app/tickets">
              <Button variant="ghost" size="sm" className="text-xs text-primary">
                View All <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
          {isLoading ? (
            <div className="px-5 py-8 text-sm text-muted-foreground">Loading tickets...</div>
          ) : unassigned.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              All tickets are assigned. Nice work! 🎉
            </div>
          ) : (
            <div className="divide-y divide-border">
              {unassigned.map((ticket) => (
                <Link
                  key={ticket.id}
                  to={`/app/tickets/${ticket.id}`}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-muted/30 transition-colors ${ticket.priority === "urgent" ? "border-l-2 border-l-status-urgent" : ""}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <StatusBadge status={ticket.status} />
                      <span className="text-xs text-muted-foreground font-mono">{ticket.id.slice(0, 8)}</span>
                      {ticket.priority === "urgent" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-urgent/10 text-status-urgent font-semibold">Urgent</span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-foreground truncate">{ticket.title}</div>
                    <div className="text-xs text-muted-foreground">{ticket.property_name ?? "—"} · Unit</div>
                  </div>
                  <Button size="sm" className="ml-4 flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all text-xs">
                    <Plus className="w-3 h-3 mr-1" /> Assign
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Today's Jobs */}
          <div className="rounded-xl border border-border bg-card card-shadow">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Today's Jobs</h2>
              <Link to="/app/calendar">
                <Button variant="ghost" size="sm" className="text-xs text-primary">
                  <CalendarIcon className="w-3 h-3 mr-1" /> Calendar
                </Button>
              </Link>
            </div>
            {isLoading ? (
              <div className="px-5 py-6 text-center text-xs text-muted-foreground">Loading...</div>
            ) : todayJobs.length === 0 ? (
              <div className="px-5 py-6 text-center text-xs text-muted-foreground">No jobs scheduled for today.</div>
            ) : (
              <div className="divide-y divide-border">
                {todayJobs.map((event) => (
                  <div key={event.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-foreground tabular-nums">{event.time}</span>
                      <StatusBadge status={event.status} className="text-[10px]" />
                    </div>
                    <div className="text-sm text-foreground">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.contractor_name} · {event.property_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming */}
          <div className="rounded-xl border border-border bg-card card-shadow">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Upcoming Schedule</h2>
            </div>
            {isLoading ? (
              <div className="px-5 py-6 text-center text-xs text-muted-foreground">Loading...</div>
            ) : upcomingJobs.length === 0 ? (
              <div className="px-5 py-6 text-center text-xs text-muted-foreground">No upcoming jobs scheduled.</div>
            ) : (
              <div className="divide-y divide-border">
                {upcomingJobs.map((event) => (
                  <div key={event.id} className="px-5 py-3">
                    <div className="text-xs text-muted-foreground tabular-nums mb-0.5">{event.date} · {event.time}</div>
                    <div className="text-sm text-foreground">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.contractor_name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
