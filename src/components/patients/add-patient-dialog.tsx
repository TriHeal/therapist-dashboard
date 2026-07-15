"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createPatient } from "@/lib/actions/patients.actions";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function AddPatientDialog({ dict }: { dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const displayName = formData.get("displayName") as string;
    const age = parseInt(formData.get("age") as string, 10);

    const result = await createPatient({ displayName, age });

    setLoading(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
        {dict.home.addPatient}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{dict.home.addPatient}</DialogTitle>
            <DialogDescription>
              {/* Optional description, can add dict if needed */}
              הכנס את פרטי המטופל החדש.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="displayName" className="text-right">
                {dict.patientTable.name}
              </Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="לדוגמא: דוד"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">
                {dict.patientTable.age}
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                min={0}
                placeholder="לדוגמא: 8"
                className="col-span-3"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              {dict.common.cancel}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "..." : dict.common.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
