import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getTickets, assignContractor } from "@/lib/data/queries";
import type { ContractorRow, TicketRow } from "@/lib/data/queries";

interface AssignJobDialogProps {
  contractor: ContractorRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned?: (ticketId: string, contractorName: string) => void;
}

export function AssignJobDialog({ contractor, open, onOpenChange, onAssigned }: AssignJobDialogProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: unassigned = [] } = useQuery({
    queryKey: ["tickets"],
    queryFn: () => getTickets(),
    enabled: open,
  });

  const assignMutation = useMutation({
    mutationFn: ({ ticketId, contractorId }: { ticketId: string; contractorId: string }) =>
      assignContractor(ticketId, contractorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket"] });
      if (contractor && selected) {
        onAssigned?.(selected, contractor.company_name);
      }
      setSelected(null);
      onOpenChange(false);
    },
  });

  const handleAssign = async () => {
    if (!selected || !contractor) return;
    assignMutation.mutate({ ticketId: selected, contractorId: contractor.id });
  };

  const handleClose = (open: boolean) => {
    if (!open) setSelected(null);
    onOpenChange(open);
  };

  const filteredTickets = unassigned.filter((t: TicketRow) => t.status !== "completed" && t.status !== "cancelled" && !t.contractor_id);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Job to {contractor?.company_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[40vh] overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">All tickets are currently assigned.</p>
          ) : (
            filteredTickets.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => setSelected(ticket.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected === ticket.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{ticket.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{ticket.id.slice(0, 8)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {ticket.property_name ?? "—"} · {ticket.category ?? "—"}
                </div>
              </button>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            onClick={handleAssign}
            disabled={!selected || assignMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Assigning...
              </>
            ) : "Assign Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
