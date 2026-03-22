import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Send, CheckCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTicket, getProperties } from "@/lib/data/queries";
import type { Property } from "@/lib/supabase";

interface PhotoPreview {
  id: string;
  url: string;
  name: string;
}

const CATEGORIES = [
  "Plumbing",
  "HVAC",
  "Electrical",
  "Appliance",
  "General Maintenance",
  "Pest Control",
  "Locksmith",
  "Other",
];

const PRIORITIES = [
  { value: "low", label: "Low — can wait a few days" },
  { value: "medium", label: "Medium — within 24–48 hrs" },
  { value: "high", label: "High — within today" },
  { value: "urgent", label: "Urgent — safety or major damage" },
];

export default function TenantPortal() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Form state
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [category, setCategory] = useState("General Maintenance");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  const { data: properties = [] } = useQuery({
    queryKey: ["properties"],
    queryFn: getProperties,
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      const unitInfo = unit.trim() ? ` Unit ${unit.trim()}` : "";
      const nameInfo = name.trim() ? ` (${name.trim()})` : "";
      return createTicket({
        title: `${category} issue${unitInfo}${nameInfo}`,
        description: description.trim() || `${category} issue submitted via tenant portal.`,
        category,
        priority: priority as "low" | "medium" | "high" | "urgent",
        property_id: propertyId || undefined,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      setSubmittedId(data?.id ?? null);
      setSubmitted(true);
      resetForm();
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const resetForm = () => {
    setName("");
    setUnit("");
    setPropertyId("");
    setCategory("General Maintenance");
    setPriority("medium");
    setDescription("");
    setPhotos([]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPhotos = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    // Reset so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return prev.filter(p => p.id !== id);
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-status-completed/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-status-completed" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h1>
          <p className="text-muted-foreground mb-2">Your maintenance request has been received and is being processed by our AI system.</p>
          <p className="text-sm text-muted-foreground mb-6">
            {submittedId ? `Ticket #${submittedId.slice(0, 8).toUpperCase()}` : "Ticket submitted"} · You'll receive email updates on progress.
          </p>
          <Button onClick={() => { setSubmitted(false); setSubmittedId(null); resetForm(); }} variant="outline" className="active:scale-[0.97] transition-all">
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-foreground">PropFix AI</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Submit a Maintenance Request</h1>
          <p className="text-muted-foreground">Describe your issue and we'll get it resolved as quickly as possible.</p>
        </div>

        <div key={submitted ? "submitted" : "form"} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tenant-name" className="text-sm font-medium text-foreground mb-1.5 block">Your Name</label>
              <Input id="tenant-name" placeholder="e.g. Jane Doe" value={name} onChange={e => setName(e.target.value)} className="bg-card" />
            </div>
            <div>
              <label htmlFor="tenant-unit" className="text-sm font-medium text-foreground mb-1.5 block">Unit Number</label>
              <Input id="tenant-unit" placeholder="e.g. 4B" value={unit} onChange={e => setUnit(e.target.value)} className="bg-card" />
            </div>
          </div>

          <div>
            <label htmlFor="property-select" className="text-sm font-medium text-foreground mb-1.5 block">Property</label>
            <select
              id="property-select"
              value={propertyId}
              onChange={e => setPropertyId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm text-foreground"
            >
              <option value="">Select a property...</option>
              {properties.map((p: Property) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issue-type" className="text-sm font-medium text-foreground mb-1.5 block">Issue Type</label>
              <select
                id="issue-type"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm text-foreground"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="urgency" className="text-sm font-medium text-foreground mb-1.5 block">Urgency</label>
              <select
                id="urgency"
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-card text-sm text-foreground"
              >
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="tenant-description" className="text-sm font-medium text-foreground mb-1.5 block">Describe the Issue</label>
            <Textarea
              id="tenant-description"
              className="min-h-[120px]"
              placeholder="Tell us what's wrong — our AI will categorize and prioritize your request automatically..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Be as specific as possible — include location, when it started, and any details that might help.</p>
          </div>

          <div>
            <label htmlFor="tenant-photos" className="text-sm font-medium text-foreground mb-1.5 block">Attach Photos (optional)</label>
            <input
              id="tenant-photos"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
            <div className="flex flex-wrap gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <Camera className="w-5 h-5 text-muted-foreground/50 mb-1" />
                <span className="text-[10px] text-muted-foreground">Upload</span>
              </button>
            </div>
            {photos.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1.5">{photos.length} photo{photos.length > 1 ? "s" : ""} attached</p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitMutation.isPending || !description.trim()}
            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all font-semibold"
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Submit Request</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
