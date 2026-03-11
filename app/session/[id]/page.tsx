'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SessionStoreProvider, useSessionStore } from '@/providers/session-store-provider';
import { Header } from '@/app/components/header';
import { Stepper } from '@/app/components/stepper';
import { UploadStep } from '@/app/components/upload-step';
import { ProcessingStep } from '@/app/components/processing-step';
import { ReviewStep } from '@/app/components/review-step';
import { FinishStep } from '@/app/components/finish-step';
import { Loader2, ArrowLeft, Stethoscope } from 'lucide-react';

function SessionContent() {
  const params = useParams<{ id: string }>();
  const session = useSessionStore((s) => s.session);
  const isProcessing = useSessionStore((s) => s.isProcessing);
  const loadSession = useSessionStore((s) => s.loadSession);

  useEffect(() => {
    if (params.id) {
      loadSession(params.id);
    }
  }, [params.id, loadSession]);

  if (!session) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative rounded-full bg-primary/10 p-3">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
        </div>
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentStatus = isProcessing ? 'processing' : session.status;

  return (
    <div className="space-y-8">
      {/* Breadcrumb + title */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{session.name}</h1>
        </div>
      </div>

      {/* Stepper */}
      <Stepper currentStatus={currentStatus} />

      {/* Step content */}
      <div>
        {currentStatus === 'uploading' && <UploadStep />}
        {currentStatus === 'processing' && <ProcessingStep />}
        {currentStatus === 'reviewing' && <ReviewStep />}
        {currentStatus === 'completed' && <FinishStep />}
      </div>
    </div>
  );
}

export default function SessionPage() {
  return (
    <SessionStoreProvider>
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-4xl px-4 py-8">
          <SessionContent />
        </main>
      </div>
    </SessionStoreProvider>
  );
}
