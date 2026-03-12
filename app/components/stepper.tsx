'use client';

import { cn } from '@/lib/utils';
import { Check, Upload, Cpu, PenLine, Download } from 'lucide-react';

const steps = [
  { key: 'uploading', label: 'Upload', icon: Upload },
  { key: 'processing', label: 'Process', icon: Cpu },
  { key: 'reviewing', label: 'Review', icon: PenLine },
  { key: 'completed', label: 'Finish', icon: Download },
];

const stepOrder = ['uploading', 'processing', 'reviewing', 'completed'];

export function Stepper({ currentStatus }: { currentStatus: string }) {
  const currentIndex = stepOrder.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const StepIcon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300',
                  isCompleted && 'gradient-brand text-white shadow-md',
                  isCurrent && 'gradient-brand-subtle border-2 border-primary text-primary glow-sm',
                  !isCompleted && !isCurrent && 'bg-muted text-muted-foreground/40',
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  isCurrent && 'text-primary',
                  isCompleted && 'text-foreground',
                  !isCurrent && !isCompleted && 'text-muted-foreground/50',
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="mx-2 mb-6 sm:mx-4">
                <div
                  className={cn(
                    'h-0.5 w-8 rounded-full transition-colors duration-300 sm:w-16',
                    index < currentIndex ? 'gradient-brand' : 'bg-border',
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
