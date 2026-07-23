"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wind,
  GitBranch,
  BookHeart,
  Plus,
  Check,
  Loader2,
  Leaf,
  EyeClosed,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createTherapySession } from "@/lib/actions/therapy-sessions.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface ActivityOption {
  type: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled: boolean;
}

const ACTIVITIES: ActivityOption[] = [
  { type: "breathing", icon: Wind, disabled: false },
  {
    type: "event_processing",
    icon: GitBranch,
    disabled: false,
  },
  {
    type: "memory_lake",
    icon: BookHeart,
    disabled: false,
  },
  {
    type: "leaf_on_water",
    icon: Leaf,
    disabled: true,
  },
  {
    type: "guided_relaxation",
    icon: EyeClosed,
    disabled: true,
  },
];

export function CreateSessionDialog({
  patientId,
  dict,
}: {
  patientId: string;
  dict: Dictionary;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const router = useRouter();

  const toggleActivity = (type: string) => {
    setSelectedActivities((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivities.length === 0) return;

    setLoading(true);
    try {
      const res = await createTherapySession(patientId, selectedActivities);
      if (res && "error" in res) {
        alert(res.error);
      } else {
        setOpen(false);
        // Reset form
        setSelectedActivities([]);
        // Redirect to live view
        router.push(`/therapist/patients/${patientId}/live`);
      }
    } catch (err) {
      console.error("Error creating therapy session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {dict.sessionsTable.newSession}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{dict.newSessionDialog.title}</DialogTitle>
          <DialogDescription>
            {dict.newSessionDialog.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleStartSession} className="space-y-6 pt-4">
          {/* Activities Grid */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {dict.newSessionDialog.selectActivities}
            </Label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ACTIVITIES.map((act) => {
                const Icon = act.icon;
                const isSelected = selectedActivities.includes(act.type);
                const displayName =
                  (dict.newSessionDialog as Record<string, string>)[act.type] ||
                  act.type;
                const isDisabled = act.disabled;

                return (
                  <button
                    key={act.type}
                    type="button"
                    onClick={() => toggleActivity(act.type)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      isDisabled
                        ? "cursor-not-allowed opacity-45"
                        : "cursor-pointer"
                    } ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary shadow-sm"
                        : "border-border hover:border-muted-foreground bg-card text-card-foreground hover:bg-accent/50"
                    }`}
                  >
                    <Icon className="h-8 w-8 mb-2 opacity-80" />
                    <span className="text-xs font-medium leading-tight px-1">
                      {displayName}
                    </span>

                    {/* Checkmark icon for selected card */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {dict.common.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedActivities.length === 0}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {dict.newSessionDialog.submit}...
                </>
              ) : (
                dict.newSessionDialog.submit
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
