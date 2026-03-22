import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Ticket as TicketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, PriorityBadge } from "@/components/app/StatusBadge";
import { NewTicketDialog } from "@/components/app/NewTicketDialog";
import { getTickets } from "@/lib/data/queries";
import type { TicketRow } from "@/lib/data/queries";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "open", label: "New" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };

export default function Tickets() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    () => searchParams.get("status") || "all"
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["tickets", statusFilter],
    queryFn: () => getTickets({ status: statusFilter !== "all" ? statusFilter : undefined }),
  });

  const filtered = tickets.filter((t: TicketRow) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !(t.property_name ?? "").toLowerCase().includes(q) &&
        !(t.contractor_name ?? "").toLowerCase().includes(q) &&
        !t.category?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  }).sort((a, b) => {
    // When viewing all/open, urgent tickets bubble to the top
    if (statusFilter === "all" || statusFilter === "open") {
      const pa = priorityOrder[a.priority] ?? 3;
      const pb = priorityOrder[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;
    }
    // Default: newest first
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Tickets</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all">
          <Plus className="w-4 h-4 mr-1.5" /> New Ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-card"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {statusFilters.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              aria-pressed={statusFilter === s.value}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                statusFilter === s.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Issue</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Property</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Unit</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden xl:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden lg:table-cell">Contractor</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground hidden md:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="px-4 py-3"><Skeleton className="h-4 w-16 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-14 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3 w-12" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-24" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-12" /></td>
                    <td className="px-4 py-3 hidden xl:table-cell"><Skeleton className="h-3 w-16" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><Skeleton className="h-3 w-24" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-3 w-16" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={99} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <TicketIcon className="w-6 h-6 text-primary" />
                      </div>
                      {tickets.length === 0 ? (
                        <>
                          <div>
                            <p className="text-sm font-medium text-foreground">No tickets yet</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Create your first ticket to get started.</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => setDialogOpen(true)}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Ticket
                          </Button>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm font-medium text-foreground">No tickets match your filters</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Try adjusting your search or filter, or clear them below.</p>
                          </div>
                          <div className="flex gap-2">
                            {(search || statusFilter !== "all") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => { setSearch(""); setStatusFilter("all"); }}
                              >
                                Clear filters
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => setDialogOpen(true)}
                            >
                              <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Ticket
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((ticket: TicketRow) => (
                  <tr
                    key={ticket.id}
                    onClick={() => navigate(`/app/tickets/${ticket.id}`)}
                    className="hover:bg-muted/20 transition-colors cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && navigate(`/app/tickets/${ticket.id}`)}
                  >
                    <td className="px-4 py-3">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{ticket.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/app/tickets/${ticket.id}`} className="font-medium text-foreground hover:text-primary transition-colors" onClick={(e) => e.stopPropagation()}>
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{ticket.property_name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{ticket.unit ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden xl:table-cell">{ticket.category ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {ticket.contractor_name ?? <span className="text-status-in-progress">Unassigned</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell tabular-nums">
                      {new Date(ticket.updated_at).toLocaleDate()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }}
      />
    </div>
  );
}
