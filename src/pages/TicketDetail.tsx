import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bot, User, Wrench, Clock, MapPin, Camera, MessageSquare, CheckCircle, Play, Send, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, PriorityBadge } from "@/components/app/StatusBadge";
import { CompletionProofDialog } from "@/components/app/CompletionProofDialog";
import { getTicketById, getContractors, getMessages, getTicketAttachments, addMessage, assignContractor, updateTicketStatus, completeTicket, setTicketSchedule } from "@/lib/data/queries";
import type { TicketRow } from "@/lib/data/queries";

interface TimelineEntry {
  time: string;
  event: string;
  type: "created" | "ai" | "system" | "status" | "assigned";
}

const statusLabels: Record<string, string> = {
  open: "New", assigned: "Assigned", in_progress: "In Progress", completed: "Completed", cancelled: "Cancelled"
};

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: ticket, isLoading } = useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id!),
    enabled: !!id,
  });

  const { data: contractors = [] } = useQuery({
    queryKey: ["contractors"],
    queryFn: getContractors,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getMessages(id!),
    enabled: !!id,
  });

  const { data: attachments = [] } = useQuery({
    queryKey: ["ticket-attachments", id],
    queryFn: () => getTicketAttachments(id!),
    enabled: !!id,
  });

  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [messageText, setMessageText] = useState("");
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => ticket?.scheduled_date ?? "");

  // Sync scheduleDate when ticket data first loads (lazy init only captures undefined)
  useEffect(() => {
    if (ticket?.scheduled_date && !scheduleDate) {
      setScheduleDate(ticket.scheduled_date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket?.scheduled_date]);

  const assignMutation = useMutation({
    mutationFn: ({ ticketId, contractorId }: { ticketId: string; contractorId: string }) =>
      assignContractor(ticketId, contractorId),
    onSuccess: (_, { contractorId }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      const contractor = contractors.find(c => c.id === contractorId);
      const now = new Date();
      const timeStr = now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
      setTimeline(prev => [{ time: timeStr, event: `Assigned to ${contractor?.company_name ?? "contractor"}`, type: "assigned" }, ...prev]);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: string }) =>
      updateTicketStatus(ticketId, status as TicketRow["status"]),
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      const now = new Date();
      const timeStr = now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
      setTimeline(prev => [{ time: timeStr, event: `Status changed to ${statusLabels[status] ?? status}`, type: "status" }, ...prev]);
    },
  });

  const messageMutation = useMutation({
    mutationFn: (content: string) => addMessage(id!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", id] });
      setMessageText("");
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: (date: string) => setTicketSchedule(id!, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["calendar-events"] });
    },
  });

  const completionMutation = useMutation({
    mutationFn: ({ notes, photos }: { notes: string; photos: unknown[] }) =>
      completeTicket(id!, notes, photos as { file_name: string; file_url: string; file_type: string }[]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket-attachments", id] });
    },
  });

  const addTimelineEntry = (event: string, type: TimelineEntry["type"]) => {
    const now = new Date();
    const timeStr = now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
    setTimeline(prev => [{ time: timeStr, event, type }, ...prev]);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!ticket) return;
    statusMutation.mutate({ ticketId: ticket.id, status: newStatus });
  };

  const handleAssign = (contractorId: string) => {
    if (!ticket) return;
    assignMutation.mutate({ ticketId: ticket.id, contractorId });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    messageMutation.mutate(messageText.trim());
  };

  const handleComplete = ({ notes, photos }: { notes: string; photos: unknown[] }) => {
    completionMutation.mutate({ notes, photos });
    addTimelineEntry("Job marked as complete", "status");
  };

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6 animate-fade-in space-y-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tickets</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-7 w-64" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-32 rounded-md" />
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          <div className="space-y-5">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-4 lg:p-6 animate-fade-in text-center py-20">
        <h2 className="text-xl font-bold text-foreground mb-2">Ticket not found</h2>
        <p className="text-muted-foreground mb-4">The ticket you're looking for doesn't exist.</p>
        <Link to="/app/tickets" className="text-primary hover:text-primary/80 text-sm">← Back to Tickets</Link>
      </div>
    );
  }

  const aiSummary = ticket.ai_triage_json as Record<string, string> | null;
  const availableContractors = contractors.filter(
    c => c.specialty === ticket.category || c.specialty === "General Maintenance"
  );
  const initialTimeline: TimelineEntry[] = [
    { time: new Date(ticket.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }), event: "Ticket created", type: "created" },
    ...(aiSummary ? [{ time: new Date(ticket.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }), event: `AI triage: ${aiSummary.category ?? ticket.category}`, type: "ai" as const }] : []),
  ];
  const allTimeline = [...timeline, ...initialTimeline];

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      {/* Back nav */}
      <Link to="/app/tickets" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Tickets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs text-muted-foreground font-mono">{ticket.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">{ticket.title}</h1>
        </div>
        <div className="flex gap-2">
          {ticket.status !== "in_progress" && ticket.status !== "completed" && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange("in_progress")}
              className="active:scale-[0.97] transition-all">
              <Play className="w-3.5 h-3.5 mr-1.5" /> Mark In Progress
            </Button>
          )}
          {ticket.status !== "completed" && (
            <Button size="sm" onClick={() => setCompleteDialogOpen(true)}
              className="bg-status-completed text-primary-foreground hover:bg-status-completed/90 active:scale-[0.97] transition-all">
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Mark Complete
            </Button>
          )}
          {ticket.status === "completed" && (
            <span className="inline-flex items-center gap-1.5 text-sm text-status-completed font-medium">
              <CheckCircle className="w-4 h-4" /> Completed
            </span>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr,380px] gap-6">
        {/* Left Column */}
        <div className="space-y-5">
          {/* AI Triage Summary */}
          {aiSummary && (
            <div className="rounded-xl border border-primary/20 bg-primary/3 p-5 card-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Triage Summary</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                  <Zap className="w-3 h-3" />
                  Auto-categorized
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(aiSummary).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-xs text-muted-foreground capitalize mb-0.5">{key.replace(/([A-Z])/g, " $1")}</div>
                    <div className="text-sm font-medium text-foreground">{value as string}</div>
                  </div>
                ))}
              </div>
              {aiSummary.suggestedTrade && (
                <div className="mt-3 pt-3 border-t border-primary/10">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-3.5 h-3.5 text-primary/70" />
                    <span className="text-xs text-muted-foreground">
                      Suggested:{" "}
                      <span className="font-medium text-foreground">
                        {(() => {
                          const trade = aiSummary.suggestedTrade as string;
                          const match = availableContractors.find(c =>
                            c.specialty.toLowerCase().includes(trade.toLowerCase()) ||
                            trade.toLowerCase().includes(c.specialty.toLowerCase())
                          );
                          return match ? `${match.company_name} (${match.specialty})` : trade;
                        })()}
                      </span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3">Issue Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{ticket.description}</p>
          </div>

          {/* Property Info */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" /> Property Info
            </h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Property:</span> <span className="font-medium text-foreground">{ticket.property_name ?? "—"}</span></div>
              <div><span className="text-muted-foreground">Address:</span> <span className="text-foreground">{ticket.property_address ?? "—"}</span></div>
              {ticket.unit && <div><span className="text-muted-foreground">Unit:</span> <span className="text-foreground">{ticket.unit}</span></div>}
            </div>
          </div>

          {/* Attached Photos */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" /> Attached Photos
            </h3>
            {attachments.length === 0 ? (
              <p className="text-xs text-muted-foreground">No photos attached yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {attachments.map(att => (
                  <a
                    key={att.id}
                    href={att.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-16 h-16 rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={att.file_url}
                      alt={att.file_name}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Assign Contractor */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-muted-foreground" /> Assign Contractor
            </h3>
            {ticket.contractor_id ? (
              <div className="p-3 rounded-lg bg-status-completed/8 border border-status-completed/15">
                <div className="text-sm font-medium text-foreground">{ticket.contractor_name ?? "Contractor"}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Currently assigned</div>
                {ticket.status !== "completed" && (
                  <Button variant="ghost" size="sm" className="mt-2 w-full text-xs text-muted-foreground h-7"
                    onClick={() => handleStatusChange("open")}>
                    Reassign
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {availableContractors.length === 0 && (
                  <p className="text-sm text-muted-foreground py-2">No contractors available for this trade.</p>
                )}
                {availableContractors.slice(0, 3).map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.company_name}</div>
                      <div className="text-xs text-muted-foreground">{c.specialty}</div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs active:scale-[0.97] transition-all"
                      onClick={() => handleAssign(c.id)}
                      disabled={assignMutation.isPending}>
                      {assignMutation.isPending ? (
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border border-primary/30 border-t-primary animate-spin inline-block" /> Assigning</span>
                      ) : "Assign"}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Scheduling
            </h3>
            {ticket.scheduled_date ? (
              <div className="space-y-2">
                <p className="text-sm text-foreground">
                  {new Date(ticket.scheduled_date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <div className="flex gap-2">
                  <label for="schedule-date-update" className="sr-only">Update schedule date</label>
                  <input
                    id="schedule-date-update"
                    type="date"
                    className="flex-1 text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7"
                    onClick={() => {
                      if (scheduleDate) {
                        scheduleMutation.mutate(scheduleDate);
                        setScheduleDate("");
                      }
                    }}
                    disabled={!scheduleDate || scheduleMutation.isPending}
                  >
                    {scheduleMutation.isPending ? "Saving..." : "Update"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No date scheduled yet.</p>
                <div className="flex gap-2">
                  <label for="schedule-date-new" className="sr-only">Schedule date</label>
                  <input
                    id="schedule-date-new"
                    type="date"
                    className="flex-1 text-xs border border-border rounded-md px-2 py-1.5 bg-background text-foreground"
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 text-xs"
                    onClick={() => {
                      if (scheduleDate) {
                        scheduleMutation.mutate(scheduleDate);
                        setScheduleDate("");
                      }
                    }}
                    disabled={!scheduleDate || scheduleMutation.isPending}
                  >
                    {scheduleMutation.isPending ? "Saving..." : "Schedule"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3">Activity Timeline</h3>
            <div className="space-y-4">
              {allTimeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      entry.type === "ai" ? "bg-primary" :
                      entry.type === "created" ? "bg-status-new" :
                      entry.type === "status" ? "bg-status-in-progress" :
                      entry.type === "assigned" ? "bg-status-completed" :
                      "bg-muted-foreground/30"
                    }`} />
                    {i < allTimeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="pb-3">
                    <div className="text-sm text-foreground">{entry.event}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">{entry.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="rounded-xl border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" /> Messages
            </h3>
            <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground/60">
                  No messages yet. Send a message to start the conversation.
                </div>
              ) : messages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg text-xs ${msg.is_system_message ? "bg-primary/5 border border-primary/10" : "bg-muted/50"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium ${msg.is_system_message ? "text-primary" : "text-foreground"}`}>
                      {msg.is_system_message ? "System" : "User"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <label htmlFor="ticket-message" className="sr-only">Message</label>
                <Input id="ticket-message" className="flex-1" placeholder="Type a message..."
                  value={messageText} onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()} />
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSendMessage} disabled={messageMutation.isPending}>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CompletionProofDialog
        jobId={ticket.id}
        jobTitle={ticket.title}
        open={completeDialogOpen}
        onOpenChange={setCompleteDialogOpen}
        onComplete={handleComplete}
      />
    </div>
  );
}
