import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTicket } from "@/lib/data/queries";

interface NewTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const issueTypes = ["Plumbing", "HVAC", "Electrical", "Locksmith", "Appliance", "Windows", "General"];
const priorities = ["low", "medium", "high", "urgent"] as const;

export function NewTicketDialog({ open, onOpenChange, onCreated }: NewTicketDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [property, setProperty] = useState("");
  const [unit, setUnit] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => createTicket({
      title: title.trim(),
      description: description.trim() || title.trim(),
      category: issueType,
      priority,
      property_id: undefined,
      tenant_id: undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      onCreated?.();
      reset();
      onOpenChange(false);
    },
  });

  const reset = () => {
    setTitle(""); setDescription(""); setProperty(""); setUnit("");
    setIssueType(""); setPriority("medium");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const canSubmit = title.trim() && issueType;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Title *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Leaking faucet in bathroom" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Issue Type *</label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {issueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Property</label>
              <Input value={property} onChange={e => setProperty(e.target.value)} placeholder="e.g. Riverside Apartments" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Unit</label>
              <Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. Unit 4B" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Priority</label>
            <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => (
                  <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..." className="min-h-[80px]" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit || createMutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {createMutation.isPending ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
