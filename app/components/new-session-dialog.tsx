'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Mic } from 'lucide-react';
import { db } from '@/lib/db';
import { MODELS } from '@/lib/ai';

export function NewSessionDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const handleCreate = async () => {
    if (!user) return;

    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const sessionName =
      name.trim() ||
      `Session - ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;

    await db.sessions.add({
      id,
      name: sessionName,
      status: 'uploading',
      records: [],
      currentRecordIndex: 0,
      model: MODELS[0],
      temperature: 0.2,
      createdAt: now,
      updatedAt: now,
      userId: user.id,
    });

    setOpen(false);
    setName('');
    router.push(`/session/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-brand glow-sm gap-2 text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl">
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand-subtle">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">New Session</DialogTitle>
          <DialogDescription className="text-center">
            Create a new transcription session for audio voice notes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="session-name" className="text-sm font-medium">
            Session Name
          </Label>
          <Input
            id="session-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Session - ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            className="mt-2"
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">Leave blank for an auto-generated name</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="gradient-brand text-white">
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
