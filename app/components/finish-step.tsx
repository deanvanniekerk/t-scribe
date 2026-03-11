'use client';

import Link from 'next/link';
import { useSessionStore } from '@/providers/session-store-provider';
import { Button } from '@/components/ui/button';
import { Download, Home, CheckCircle2, FileText } from 'lucide-react';

export function FinishStep() {
  const session = useSessionStore((s) => s.session);
  const downloadZip = useSessionStore((s) => s.downloadZip);

  if (!session) return null;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Success icon */}
      <div className="relative">
        <div className="absolute -inset-3 rounded-full bg-emerald-500/10 animate-pulse-glow" />
        <div className="relative rounded-2xl bg-emerald-500/10 p-5">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Session Complete</h2>
        <p className="mt-1 text-muted-foreground">
          {session.records.length} referral email{session.records.length !== 1 ? 's' : ''} ready for download
        </p>
      </div>

      {/* Record summary */}
      <div className="w-full max-w-sm rounded-xl border border-border/60 bg-card">
        <div className="divide-y divide-border/30">
          {session.records.map((record, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md gradient-brand-subtle">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{record.patientName}</p>
                <p className="text-xs text-muted-foreground">{record.fileNumber}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3">
        <Button
          size="lg"
          onClick={downloadZip}
          className="gradient-brand glow-sm h-12 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
        >
          <Download className="mr-2 h-5 w-5" />
          Download ZIP
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link href="/">
            <Home className="mr-1.5 h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
