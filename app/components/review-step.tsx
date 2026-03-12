'use client';

import { useSessionStore } from '@/providers/session-store-provider';
import { Button } from '@/components/ui/button';
import { RecordForm } from './record-form';
import { ChevronLeft, ChevronRight, Check, FileText } from 'lucide-react';

export function ReviewStep() {
  const session = useSessionStore((s) => s.session);
  const nextRecord = useSessionStore((s) => s.nextRecord);
  const prevRecord = useSessionStore((s) => s.prevRecord);
  const finishSession = useSessionStore((s) => s.finishSession);

  if (!session || session.records.length === 0) return null;

  const { currentRecordIndex, records } = session;
  const isFirst = currentRecordIndex === 0;
  const isLast = currentRecordIndex === records.length - 1;

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand-subtle">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">
              Record {currentRecordIndex + 1} of {records.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {records[currentRecordIndex]?.patientName || 'Untitled'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Record dots */}
          <div className="mr-2 hidden items-center gap-1 sm:flex">
            {records.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentRecordIndex ? 'w-4 gradient-brand' : 'w-1.5 bg-border'
                }`}
              />
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={prevRecord} disabled={isFirst}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Prev
          </Button>
          {isLast ? (
            <Button size="sm" className="gradient-brand text-white" onClick={finishSession}>
              <Check className="mr-1 h-4 w-4" />
              Finish
            </Button>
          ) : (
            <Button size="sm" onClick={nextRecord}>
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <RecordForm index={currentRecordIndex} />
      </div>
    </div>
  );
}
