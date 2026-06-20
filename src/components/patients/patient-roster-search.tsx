"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATIENT_STATUS_BADGE_VARIANT } from "@/lib/constants";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { Patient, PatientStatus } from "@/types";

export function PatientRosterSearch({
  patients,
  dict,
  locale,
}: {
  patients: Patient[];
  dict: Dictionary;
  locale: Locale;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "all">("all");
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const matchesQuery = p.displayName.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [patients, query, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={dict.patientsPage.searchPlaceholder}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PatientStatus | "all")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{dict.patientsPage.filterAllStatuses}</SelectItem>
            <SelectItem value="active">{dict.patientStatus.active}</SelectItem>
            <SelectItem value="paused">{dict.patientStatus.paused}</SelectItem>
            <SelectItem value="completed">{dict.patientStatus.completed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{dict.patientsPage.noResults}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.patientTable.name}</TableHead>
              <TableHead>{dict.patientTable.age}</TableHead>
              <TableHead>{dict.patientTable.status}</TableHead>
              <TableHead>{dict.patientTable.lastSession}</TableHead>
              <TableHead>{dict.patientTable.parentSharing}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <Link href={`/patients/${p.id}`} className="font-medium hover:underline">
                    {p.displayName}
                  </Link>
                </TableCell>
                <TableCell>{p.age}</TableCell>
                <TableCell>
                  <Badge variant={PATIENT_STATUS_BADGE_VARIANT[p.status]}>
                    {dict.patientStatus[p.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {p.lastSessionAt
                    ? new Date(p.lastSessionAt).toLocaleDateString(dateLocale)
                    : dict.common.notAvailable}
                </TableCell>
                <TableCell>{p.parentSharingEnabled ? dict.common.enabled : dict.common.disabled}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
