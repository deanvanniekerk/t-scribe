'use client';

import { useSessionStore } from '@/providers/session-store-provider';
import { Progress } from '@/components/ui/progress';
import { Cpu, FileAudio } from 'lucide-react';

export function ProcessingStep() {
  const progress = useSessionStore((s) => s.progress);
  const processingFileName = useSessionStore((s) => s.processingFileName);
  const session = useSessionStore((s) => s.session);

  const processedCount = session?.records.length ?? 0;

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Animated icon */}
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        <div className="absolute -inset-4 animate-pulse-glow rounded-full bg-primary/5" />
        <div className="relative rounded-2xl gradient-brand glow-sm p-5">
          <Cpu className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight">Processing Audio Files</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Transcribing and formatting referral emails...
        </p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md space-y-3">
        <div className="overflow-hidden rounded-full bg-muted">
          <Progress value={progress} className="h-2.5 transition-all duration-500" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-primary">{progress}%</span>
          <span className="text-muted-foreground">
            {processedCount} record{processedCount !== 1 ? 's' : ''} done
          </span>
        </div>
      </div>

      {/* Current file */}
      {processingFileName && (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-4 py-2.5">
          <div className="animate-pulse rounded-md gradient-brand-subtle p-1.5">
            <FileAudio className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">{processingFileName}</span>
        </div>
      )}
    </div>
  );
}
