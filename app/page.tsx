'use client';

import { useAuth, SignInButton } from '@clerk/nextjs';
import { Header } from '@/app/components/header';
import { SessionList } from '@/app/components/session-list';
import { NewSessionDialog } from '@/app/components/new-session-dialog';
import { Button } from '@/components/ui/button';
import { Stethoscope, Loader2, Mic, FileText, Download } from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative rounded-full bg-primary/10 p-3">
              <Stethoscope className="h-6 w-6 text-primary" />
            </div>
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="gradient-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-primary/20 animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-primary/15 animate-pulse-glow [animation-delay:0.5s]" />
          <div className="absolute bottom-1/3 left-1/3 h-1 w-1 rounded-full bg-primary/25 animate-pulse-glow [animation-delay:1s]" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo */}
          <div className="animate-float mb-8">
            <div className="glow-sm rounded-2xl gradient-brand p-4">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-2 text-5xl font-bold tracking-tight">
            <span className="text-gradient">t-scribe</span>
          </h1>
          <p className="mb-10 max-w-md text-center text-lg text-muted-foreground">
            Transform voice notes into professional ophthalmology referral emails with AI
          </p>

          {/* Feature pills */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Mic className="h-4 w-4 text-primary" />
              <span>Upload Audio</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>AI Transcription</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Download className="h-4 w-4 text-primary" />
              <span>Export Emails</span>
            </div>
          </div>

          {/* Sign in button */}
          <SignInButton mode="modal">
            <Button size="lg" className="gradient-brand glow-sm h-12 px-8 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
              Get Started
            </Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sessions</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your transcription sessions</p>
          </div>
          <NewSessionDialog />
        </div>
        <SessionList />
      </main>
    </div>
  );
}
