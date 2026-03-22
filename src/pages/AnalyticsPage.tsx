import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, PriorityBadge } from "@/components/app/StatusBadge";
import { getTickets } from "@/lib/data/queries";

export default function AnalyticsPage() {
  const { data: allTickets = [], isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
  });

  const total = allTickets.length;
  const completed = allTickets.filter(t => t.status === "completed").length;
  const inProgress = allTickets.filter(t => t.status === "in_progress").length;
  const open = allTickets.filter(t => t.status === "open" || t.status === "assigned").length;
  const urgent = allTickets.filter(t => t.priority === "urgent").length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const categoryCounts: Record<string, number> = {};
  for (const t of allTickets) {
    if (t.category) categoryCounts[t.category] = (categoryCounts[t.category] ?? 0) + 1;
  }
  const topCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const priorityCounts = allTickets.reduce<Record<string, number>>((acc, t) => {
    acc[t.priority] = (acc[t.priority] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-foreground mb-1">Analytics</h1>
        <p className="text-sm text-muted-foreground">Maintenance performance overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Tickets</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold tabular-nums text-foreground">{total}</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-status-completed" />
            <span className="text-xs text-muted-foreground">Completion Rate</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold tabular-nums text-status-completed">{completionRate}%</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-status-in-progress" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold tabular-nums text-status-in-progress">{inProgress}</div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 card-shadow">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-status-urgent" />
            <span className="text-xs text-muted-foreground">Urgent</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <div className="text-2xl font-bold tabular-nums text-status-urgent">{urgent}</div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Category breakdown */}
        <div className="rounded-xl border border-border bg-card card-shadow">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Tickets by Category</h2>
          </div>
          <div className="p-5 space-y-3">
            {isLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)
            ) : topCategories.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">No data yet</p>
                <p className="text-xs text-muted-foreground">Ticket categories will appear here once data is available.</p>
              </div>
            ) : (
              topCategories.map(([cat, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={cat} className="flex items-center gap-3">
                    <div className="w-28 text-sm text-muted-foreground truncate">{cat}</div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs font-medium text-foreground tabular-nums text-right">{count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="rounded-xl border border-border bg-card card-shadow">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Tickets by Priority</h2>
          </div>
          <div className="p-5 space-y-3">
            {isLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)
            ) : (
              Object.entries(priorityCounts).map(([priority, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                return (
                  <div key={priority} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-muted-foreground capitalize flex items-center gap-1.5">
                      <PriorityBadge priority={priority} />
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs font-medium text-foreground tabular-nums text-right">{count}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="rounded-xl border border-border bg-card card-shadow">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Recent Tickets</h2>
        </div>
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map(i => (
              <div key={i} className="px-5 py-3 flex items-center gap-4">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : allTickets.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No tickets yet</p>
            <p className="text-xs text-muted-foreground">Submitted maintenance requests will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {allTickets.slice(0, 10).map(ticket => (
              <div key={ticket.id} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-sm text-foreground truncate">{ticket.title}</span>
                </div>
                <span className="text-xs text-muted-foreground tabular-nums flex-shrink-0 ml-2">
                  {new Date(ticket.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
