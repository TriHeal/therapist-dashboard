"use client";

import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n/dictionaries";
import type { Session } from "@/types";

export function SessionsTableContainer({
  sessions,
  dict,
  locale,
}: {
  sessions: Session[];
  patientId: string;
  dict: Dictionary;
  locale: Locale;
}) {
  const dateLocale = locale === "he" ? "he-IL" : "en-US";

  // Helper to translate activity types safely
  const getActivityName = (type: string) => {
    return (dict.newSessionDialog as Record<string, string>)[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {dict.patientSubnav.sessions}
        </h2>
        <Button onClick={() => alert("New Session Dialog modal placeholder (PR 3)")}>
          <Plus className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {dict.sessionsTable.newSession}
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {dict.sessionsTable.noSessions}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">{dict.sessionsTable.id}</TableHead>
                <TableHead>{dict.sessionsTable.date}</TableHead>
                <TableHead>{dict.sessionsTable.type}</TableHead>
                <TableHead>{dict.sessionsTable.status}</TableHead>
                <TableHead>{dict.sessionsTable.activities}</TableHead>
                <TableHead>{dict.sessionsTable.notes}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">{session.id}</TableCell>
                  <TableCell>
                    {new Date(session.startedAt).toLocaleString(dateLocale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {dict.sessionType[session.type] || session.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        session.status === "completed"
                          ? "default"
                          : session.status === "in_progress"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {dict.sessionStatus[session.status] || session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {session.activities && session.activities.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {session.activities.map((act) => (
                          <Badge key={act.type} variant="secondary" className="text-xs">
                            {getActivityName(act.type)}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={session.notes}>
                    {session.notes || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
