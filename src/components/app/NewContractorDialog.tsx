import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createContractor } from "@/lib/data/queries";

const SPECIALTIES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Appliance",
  "General Maintenance",
  "Pest Control",
  "Locksmith",
  "Carpentry",
  "Painting",
  "Other",
];

interface NewContractorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewContractorDialog({ open, onOpenChange }: NewContractorDialogProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    company_name: "",
    specialty: "General Maintenance",
    email: "",
    phone: "",
    license_number: "",
    hourly_rate: "",
  });

  const mutation = useMutation({
    mutationFn: createContractor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractors"] });
      setForm({ company_name: "", specialty: "General Maintenance", email: "", phone: "", license_number: "", hourly_rate: "" });
      onOpenChange(false);
    },
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid = form.company_name.trim() && form.specialty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Contractor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label htmlFor="contractor-company" className="text-sm font-medium text-foreground mb-1.5 block">
              Company Name *
            </label>
            <Input
              id="contractor-company"
              value={form.company_name}
              onChange={handleChange("company_name")}
              placeholder="e.g. ABC Plumbing Co."
            />
          </div>
          <div>
            <label htmlFor="contractor-specialty" className="text-sm font-medium text-foreground mb-1.5 block">
              Specialty *
            </label>
            <select
              id="contractor-specialty"
              value={form.specialty}
              onChange={handleChange("specialty")}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm text-foreground"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contractor-email" className="text-sm font-medium text-foreground mb-1.5 block">
                Email
              </label>
              <Input
                id="contractor-email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label htmlFor="contractor-phone" className="text-sm font-medium text-foreground mb-1.5 block">
                Phone
              </label>
              <Input
                id="contractor-phone"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contractor-license" className="text-sm font-medium text-foreground mb-1.5 block">
                License #
              </label>
              <Input
                id="contractor-license"
                value={form.license_number}
                onChange={handleChange("license_number")}
                placeholder="e.g. PLB-12345"
              />
            </div>
            <div>
              <label htmlFor="contractor-rate" className="text-sm font-medium text-foreground mb-1.5 block">
                Hourly Rate
              </label>
              <Input
                id="contractor-rate"
                type="number"
                min="0"
                value={form.hourly_rate}
                onChange={handleChange("hourly_rate")}
                placeholder="e.g. 85"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() =>
              mutation.mutate({
                company_name: form.company_name.trim(),
                specialty: form.specialty,
                email: form.email.trim() || undefined,
                phone: form.phone.trim() || undefined,
                license_number: form.license_number.trim() || undefined,
                hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : undefined,
              })
            }
            disabled={!isValid || mutation.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {mutation.isPending ? "Adding..." : "Add Contractor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
