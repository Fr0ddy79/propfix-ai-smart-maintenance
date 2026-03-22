import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, CheckCircle, Play, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge } from "@/components/app/StatusBadge";
import { CompletionProofDialog } from "@/components/app/CompletionProofDialog";
import { getContractors, getContractorTickets, updateTicketStatus } from "@/lib/data/queries";
import type { ContractorRow, TicketRow } from "@/lib/data/queries";

export default function ContractorPortal() {
  const [activeContractorId, setActiveContractorId] = useState<string | null>(null);
  const [completionJob, setCompletionJob] = useState<TicketRow | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contractors = [] } = useQuery({
    queryKey: ["contractors"],
    queryFn: getContractors,
  });

  const activeContractor = contractors.find(c => c.id === activeContractorId) ?? contractors[0] ?? null;

  const { data: contractorJobs = [] } = useQuery({
    queryKey: ["contractor-tickets", activeContractorId],
    queryFn: () => getContractorTickets(activeContractorId!),
    enabled: !!activeContractorId,
  });

  const statusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: TicketRow["status"] }) =>
      updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });

  const handleStatusChange = (job: TicketRow, newStatus: TicketRow["status"]) => {
    statusMutation.mutate({ ticketId: job.id, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <span className="font-bold text-foreground block text-sm">PropFix AI</span>
                <span className="text-xs text-muted-foreground">Contractor Portal</span>
              </div>
            </div>
          </div>
          {/* Contractor switcher */}
          {contractors.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSwitcherOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted/30 transition-colors text-sm"
              >
                <span className="text-foreground font-medium">{activeContractor?.company_name ?? "Select contractor"}</span>
                <span className="text-muted-foreground text-xs">{activeContractor?.specialty}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {switcherOpen && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-xl shadow-lg z-50 py-1 animate-fade-in">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-xs text-muted-foreground">Demo mode — select contractor</p>
                  </div>
                  {contractors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveContractorId(c.id); setSwitcherOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 hover:bg-muted/30 transition-colors ${c.id === activeContractorId ? "bg-primary/5" : ""}`}
                    >
                      <div className="text-sm font-medium text-foreground">{c.company_name}</div>
                      <div className="text-xs text-muted-foreground">{c.specialty} · {c.is_available ? "Available" : "Offline"}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">My Assigned Jobs</h1>
          {activeContractor && (
            <p className="text-sm text-muted-foreground">{activeContractor.company_name} · {activeContractor.specialty}</p>
          )}
        </div>

        {!activeContractor ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No contractors found. Connect your account to see assigned jobs.
          </div>
        ) : contractorJobs.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No jobs assigned to {activeContractor.company_name} right now.
          </div>
        ) : (
          <div className="space-y-4">
            {contractorJobs.map(job => (
              <div key={job.id} className="rounded-xl border border-border bg-card p-5 card-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={job.status} />
                      <PriorityBadge priority={job.priority} />
                      <span className="text-xs text-muted-foreground font-mono">{job.id.slice(0, 8)}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{job.title}</h3>
                  </div>
                  {job.scheduled_date && (
                    <span className="text-xs text-primary font-medium tabular-nums">
                      {new Date(job.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3">{job.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {job.property_name ?? "—"}
                  </span>
                  {job.tenant_name && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {job.tenant_name}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {job.status === "open" || job.status === "assigned" ? (
                    <Button
                      size="sm"
                      className="bg-status-in-progress text-primary-foreground hover:bg-status-in-progress/90 active:scale-[0.97] transition-all text-xs"
                      onClick={() => handleStatusChange(job, "in_progress")}
                      disabled={statusMutation.isPending}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {statusMutation.isPending ? "Starting..." : "Start Job"}
                    </Button>
                  ) : null}
                  {job.status === "in_progress" ? (
                    <Button
                      size="sm"
                      className="bg-status-completed text-primary-foreground hover:bg-status-completed/90 active:scale-[0.97] transition-all text-xs"
                      onClick={() => setCompletionJob(job)}
                    >
                      <CheckCircle className="w-3 h-3 mr-1" /> Mark Complete
                    </Button>
                  ) : null}
                  {job.status === "completed" ? (
                    <span className="text-xs text-status-completed font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : null}
                  {job.tenant_phone && (
                    <a href={`tel:${job.tenant_phone}`} className="ml-auto">
                      <Button variant="outline" size="sm" className="text-xs active:scale-[0.97] transition-all">
                        <Phone className="w-3 h-3 mr-1" /> Call Tenant
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CompletionProofDialog
        jobId={completionJob?.id ?? ""}
        jobTitle={completionJob?.title ?? ""}
        open={completionJob !== null}
        onOpenChange={(open) => { if (!open) setCompletionJob(null); }}
        onComplete={() => {
          if (completionJob) {
            handleStatusChange(completionJob, "completed");
          }
        }}
      />
    </div>
  );
}
