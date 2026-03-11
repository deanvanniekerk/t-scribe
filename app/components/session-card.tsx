'use client';

import Link from 'next/link';
import type { Session } from '@/app/types';
import { Badge } from '@/components/ui/badge';
import { FileAudio, Calendar, ChevronRight, Upload, Cpu, PenLine, CheckCircle2 } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  uploading: { color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: Upload, label: 'Uploading' },
  processing: { color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Cpu, label: 'Processing' },
  reviewing: { color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', icon: PenLine, label: 'Reviewing' },
  completed: { color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2, label: 'Complete' },
};

export function SessionCard({ session }: { session: Session }) {
  const date = new Date(session.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const status = statusConfig[session.status] ?? statusConfig.uploading;
  const StatusIcon = status.icon;

  return (
    <Link href={`/session/${session.id}`}>
      <div className="group relative rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent/30 hover:shadow-md hover:shadow-primary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg gradient-brand-subtle">
              <FileAudio className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold tracking-tight">{session.name}</span>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {date}
                </span>
                <span className="text-border">|</span>
                <span>{session.records.length} record{session.records.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`gap-1 ${status.color}`}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </Link>
  );
}
