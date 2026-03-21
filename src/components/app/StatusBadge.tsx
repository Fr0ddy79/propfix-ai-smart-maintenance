import { cn } from "@/lib/utils";

// Supports both DB statuses (open, in_progress, assigned, completed, cancelled)
// and legacy mock statuses (new, in-progress, completed, urgent)
const statusConfig: Record<string, { label: string; className: string; dotClass: string }> = {
  // DB statuses
  open:       { label: "New",          className: "bg-status-new/10 text-status-new border-status-new/20",         dotClass: "bg-status-new" },
  assigned:   { label: "Assigned",    className: "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20", dotClass: "bg-status-in-progress" },
  in_progress:{ label: "In Progress",  className: "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20", dotClass: "bg-status-in-progress" },
  completed:  { label: "Completed",    className: "bg-status-completed/10 text-status-completed border-status-completed/20", dotClass: "bg-status-completed" },
  cancelled:  { label: "Cancelled",    className: "bg-muted text-muted-foreground border-muted", dotClass: "bg-muted-foreground/40" },
  // Legacy mock statuses
  new:        { label: "New",          className: "bg-status-new/10 text-status-new border-status-new/20",         dotClass: "bg-status-new" },
  "in-progress": { label: "In Progress", className: "bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20", dotClass: "bg-status-in-progress" },
  urgent:     { label: "Urgent",      className: "bg-status-urgent/10 text-status-urgent border-status-urgent/20", dotClass: "bg-status-urgent animate-pulse-soft" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/40" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", config.className, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", config.dotClass)} />
      {config.label}
    </span>
  );
}
