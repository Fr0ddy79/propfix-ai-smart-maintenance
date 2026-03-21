import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, X } from "lucide-react";
import { completeTicket } from "@/lib/data/queries";

interface PhotoPreview {
  id: string;
  url: string;
  name: string;
}

interface CompletionProofDialogProps {
  jobId: string;
  jobTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function CompletionProofDialog({ jobId, jobTitle, open, onOpenChange, onComplete }: CompletionProofDialogProps) {
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<PhotoPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completeMutation = useMutation({
    mutationFn: () => completeTicket(jobId, notes, []),
    onSuccess: () => {
      onComplete?.();
      setNotes("");
      setPhotos([]);
      onOpenChange(false);
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newPhotos = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSubmit = () => {
    completeMutation.mutate();
  };

  const handleClose = (open: boolean) => {
    if (!open) { setNotes(""); setPhotos([]); }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Job — {jobTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Completion Notes *</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Describe what was done, parts replaced, or any follow-up needed..."
              className="min-h-[80px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Completion Photos (optional)</label>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
            <div className="flex flex-wrap gap-2">
              {photos.map(photo => (
                <div key={photo.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border group">
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(photo.id)}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                <Camera className="w-4 h-4 text-muted-foreground/50 mb-0.5" />
                <span className="text-[9px] text-muted-foreground">Add</span>
              </button>
            </div>
            {photos.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">{photos.length} photo{photos.length > 1 ? "s" : ""} attached</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!notes.trim() || completeMutation.isPending}
            className="bg-status-completed text-primary-foreground hover:bg-status-completed/90"
          >
            {completeMutation.isPending ? "Submitting..." : "Mark as Complete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
