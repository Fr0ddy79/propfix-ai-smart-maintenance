import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { AssignJobDialog } from "@/components/app/AssignJobDialog";
import { NewContractorDialog } from "@/components/app/NewContractorDialog";
import { getContractors, getContractorActiveCounts } from "@/lib/data/queries";
import type { ContractorRow } from "@/lib/data/queries";

const availabilityConfig: Record<string, { label: string; className: string }> = {
  true:  { label: "Available", className: "bg-status-completed/10 text-status-completed" },
  false: { label: "Offline", className: "bg-muted text-muted-foreground" },
};

export default function Contractors() {
  const [selectedContractor, setSelectedContractor] = useState<ContractorRow | null>(null);
  const [addContractorOpen, setAddContractorOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ["contractors"],
    queryFn: getContractors,
  });

  const { data: activeCounts = {} } = useQuery({
    queryKey: ["contractor-active-counts"],
    queryFn: getContractorActiveCounts,
  });

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Contractors</h1>
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all"
          onClick={() => setAddContractorOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Contractor
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 card-shadow animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-3" />
              <div className="h-3 bg-muted rounded w-3/4 mb-4" />
              <div className="h-8 bg-muted rounded mb-4" />
            </div>
          ))}
        </div>
      ) : contractors.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No contractors yet</h3>
          <p className="text-xs text-muted-foreground mb-4">Add your first contractor to start assigning jobs.</p>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all"
            onClick={() => setAddContractorOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Contractor
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contractors.map((c) => {
            const avail = availabilityConfig[String(c.is_available)] ?? availabilityConfig["false"];
            return (
              <div key={c.id} className="rounded-xl border border-border bg-card p-5 card-shadow hover:card-shadow-hover transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.company_name}</div>
                    <div className="text-xs text-muted-foreground">{c.specialty}</div>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", avail.className)}>
                    {avail.label}
                  </span>
                </div>

                <div className="text-xs text-muted-foreground mb-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {c.specialty}
                  </span>
                  {c.hourly_rate && (
                    <span className="ml-2 text-muted-foreground">${c.hourly_rate}/hr</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  {c.email && <span className="truncate">{c.email}</span>}
                  {activeCounts[c.id] ? (
                    <span className="text-status-in-progress font-medium tabular-nums">
                      {activeCounts[c.id]} active job{activeCounts[c.id] !== 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs active:scale-[0.97] transition-all">
                        <Phone className="w-3 h-3 mr-1" /> Call
                      </Button>
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full text-xs active:scale-[0.97] transition-all">
                        <Mail className="w-3 h-3 mr-1" /> Email
                      </Button>
                    </a>
                  )}
                  <Button size="sm"
                    className="flex-1 text-xs bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all"
                    onClick={() => setSelectedContractor(c)}>
                    Assign Job
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AssignJobDialog
        contractor={selectedContractor}
        open={selectedContractor !== null}
        onOpenChange={(open) => { if (!open) setSelectedContractor(null); }}
        onAssigned={() => {
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }}
      />

      <NewContractorDialog
        open={addContractorOpen}
        onOpenChange={setAddContractorOpen}
      />
    </div>
  );
}
