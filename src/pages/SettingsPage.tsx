import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Users, Bell, CreditCard, Puzzle, Shield, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getProperties, createProperty, getProfiles, updateProfile } from "@/lib/data/queries";
import type { Profile } from "@/lib/supabase";

const sectionIcons = { Building2, Users, Bell, CreditCard, Puzzle, Shield };
const sectionKeys = ["Properties", "Team Members", "Notifications", "Billing", "Integrations", "Security"] as const;

interface NotificationPrefs {
  emailNotifications: boolean;
  smsUrgent: boolean;
  weeklyDigest: boolean;
}

export default function SettingsPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ Properties: true });
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: "", units: "", address: "" });
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    emailNotifications: true,
    smsUrgent: true,
    weeklyDigest: false,
  });
  const queryClient = useQueryClient();

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });

  const createMutation = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setNewProperty({ name: "", units: "", address: "" });
      setAddPropertyOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...rest }: { id: string } & Parameters<typeof updateProfile>[1]) =>
      updateProfile(id, rest),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleAddProperty = () => {
    if (!newProperty.name.trim() || !newProperty.units) return;
    createMutation.mutate({
      name: newProperty.name.trim(),
      address: newProperty.address.trim(),
      unit_count: parseInt(newProperty.units, 10) || 0,
    });
  };

  const nextBillingDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  })();

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <h1 className="text-xl font-bold text-foreground">Settings</h1>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Properties */}
        <Collapsible open={openSections.Properties} onOpenChange={(v) => setOpenSections((prev) => ({ ...prev, Properties: v }))}>
          <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-foreground">Properties</h3>
                  <p className="text-xs text-muted-foreground">{properties.length} properties · {properties.reduce((a, p) => a + ((p as { unit_count?: number }).unit_count ?? 0), 0)} total units</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!openSections.Properties ? "-rotate-90" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="divide-y divide-border border-t border-border">
                {properties.map((property) => (
                  <div key={property.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-foreground">{property.name}</div>
                        <div className="text-xs text-muted-foreground">{(property as { unit_count?: number }).unit_count ?? 0} units · {property.address}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">Edit</Button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setAddPropertyOpen(true)}
                  className="w-full flex items-center gap-2 px-5 py-3 text-sm text-primary hover:bg-primary/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Property
                </button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Team Members */}
        <Collapsible open={openSections["Team Members"]} onOpenChange={(v) => setOpenSections((prev) => ({ ...prev, "Team Members": v }))}>
          <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-foreground">Team Members</h3>
                  <p className="text-xs text-muted-foreground">{profiles.length} members</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!openSections["Team Members"] ? "-rotate-90" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="divide-y divide-border border-t border-border">
                {profiles.map((member: Profile) => (
                  <div key={member.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">{member.full_name ?? member.email}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">{member.role}</span>
                  </div>
                ))}
                <button
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => window.alert("Team invites coming soon — share your dashboard URL to get started.")}
                >
                  <Plus className="w-3.5 h-3.5" /> Invite Member
                </button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Notifications */}
        <Collapsible open={openSections.Notifications} onOpenChange={(v) => setOpenSections((prev) => ({ ...prev, Notifications: v }))}>
          <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {Object.values(notifications).filter(Boolean).length} of {Object.keys(notifications).length} enabled
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${!openSections.Notifications ? "-rotate-90" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="divide-y divide-border border-t border-border">
                {[
                  { key: "emailNotifications", label: "Email notifications", description: "Receive ticket updates via email" },
                  { key: "smsUrgent", label: "SMS for urgent tickets", description: "Text alerts for urgent and high-priority" },
                  { key: "weeklyDigest", label: "Weekly digest", description: "Summary of all ticket activity each week" },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                    <Switch
                      checked={notifications[key as keyof NotificationPrefs]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Billing */}
        <div className="rounded-xl border border-border bg-card card-shadow overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Billing</h3>
              <p className="text-xs text-muted-foreground">Manage subscription</p>
            </div>
          </div>
          <div className="divide-y divide-border border-t border-border">
            {[
              { label: "Plan", value: "Professional ($249/mo)" },
              { label: "Next billing", value: nextBillingDate },
              { label: "Payment", value: "Visa ****4242" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
            <button
              className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm text-primary hover:bg-primary/5 transition-colors"
              onClick={() => window.alert("Billing management coming soon — contact hello@propfix.ai for changes.")}
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>

      {/* Add Property Dialog */}
      <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label htmlFor="prop-name" className="text-sm font-medium text-foreground mb-1.5 block">Property Name *</label>
              <Input
                id="prop-name"
                value={newProperty.name}
                onChange={(e) => setNewProperty((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sunset View Apartments"
              />
            </div>
            <div>
              <label htmlFor="prop-units" className="text-sm font-medium text-foreground mb-1.5 block">Number of Units *</label>
              <Input
                id="prop-units"
                type="number"
                min="1"
                value={newProperty.units}
                onChange={(e) => setNewProperty((p) => ({ ...p, units: e.target.value }))}
                placeholder="e.g. 12"
              />
            </div>
            <div>
              <label htmlFor="prop-address" className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
              <Input
                id="prop-address"
                value={newProperty.address}
                onChange={(e) => setNewProperty((p) => ({ ...p, address: e.target.value }))}
                placeholder="e.g. 123 Main St, Austin TX"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPropertyOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddProperty}
              disabled={!newProperty.name.trim() || !newProperty.units || createMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createMutation.isPending ? "Adding..." : "Add Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
