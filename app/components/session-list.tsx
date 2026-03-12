'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useUser } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { SessionCard } from './session-card';
import { Mic, Loader2 } from 'lucide-react';

export function SessionList() {
  const { user } = useUser();

  const sessions = useLiveQuery(
    () => (user ? db.sessions.where('userId').equals(user.id).reverse().sortBy('createdAt') : []),
    [user?.id],
  );

  if (!sessions) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/60 py-20">
        <div className="rounded-full bg-muted p-4">
          <Mic className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div className="text-center">
          <p className="font-medium text-muted-foreground">No sessions yet</p>
          <p className="mt-1 text-sm text-muted-foreground/60">Create a new session to start transcribing voice notes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>
  );
}
