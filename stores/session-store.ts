import { FileUploadResponse, type ProcessRequest, Record, type Session } from '@/app/types';
import { MODELS } from '@/lib/ai';
import { db } from '@/lib/db';
import { retry } from '@/lib/promise';
import { downloadSessionZip } from '@/lib/zip';
import { createStore } from 'zustand/vanilla';
import { toast } from 'sonner';

export type SessionState = {
  session: Session | null;
  isProcessing: boolean;
  isReprocessing: boolean;
  progress: number;
  processingFileName: string;
};

export type SessionActions = {
  loadSession: (id: string) => Promise<void>;
  createSession: (name: string, userId: string) => Promise<string>;
  uploadAndProcess: (files: FileList) => Promise<void>;
  updateRecord: (index: number, record: Record) => void;
  reprocess: (index: number, model: string) => Promise<void>;
  nextRecord: () => void;
  prevRecord: () => void;
  setModel: (model: string) => void;
  setTemperature: (temperature: number) => void;
  finishSession: () => void;
  downloadZip: () => Promise<void>;
  reset: () => void;
};

export type SessionStore = SessionState & SessionActions;

export const defaultInitState: SessionState = {
  session: null,
  isProcessing: false,
  isReprocessing: false,
  progress: 0,
  processingFileName: '',
};

async function persistSession(session: Session) {
  const updated = { ...session, updatedAt: new Date().toISOString() };
  await db.sessions.put(updated);
  return updated;
}

export const createSessionStore = (initState: SessionState = defaultInitState) => {
  return createStore<SessionStore>()((set, get) => ({
    ...initState,

    reset: () => set({ ...defaultInitState }),

    loadSession: async (id: string) => {
      const session = await db.sessions.get(id);
      if (session) {
        set({ session });
      }
    },

    createSession: async (name: string, userId: string) => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const session: Session = {
        id,
        name,
        status: 'uploading',
        records: [],
        currentRecordIndex: 0,
        model: MODELS[0],
        temperature: 0.2,
        createdAt: now,
        updatedAt: now,
        userId,
      };
      await db.sessions.add(session);
      set({ session });
      return id;
    },

    uploadAndProcess: async (files: FileList) => {
      const session = get().session;
      if (!session) return;

      let currentProgress = 0;
      const totalProgress = files.length * 2;

      try {
        const updatedSession = await persistSession({ ...session, status: 'processing', records: [] });
        set({ session: updatedSession, isProcessing: true, progress: 0 });

        for (const file of files) {
          set({ processingFileName: file.name });

          const formData = new FormData();
          formData.append(file.name, file);

          const fileUploadResponse = await retry(
            () =>
              fetch('/api/file-upload', {
                method: 'POST',
                body: formData,
              }).then((res) => {
                if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
                return res.json();
              }),
            { retries: 5 },
          );

          currentProgress += 1;
          set({ progress: Math.ceil((currentProgress / totalProgress) * 100) });

          const parsedUpload = FileUploadResponse.parse(fileUploadResponse);

          const request: ProcessRequest = {
            model: get().session!.model,
            file: parsedUpload,
            temperature: get().session!.temperature,
          };

          const recordResponse = await retry(
            () =>
              fetch('/api/scriber', {
                method: 'POST',
                body: JSON.stringify(request),
              }).then((res) => {
                if (!res.ok) throw new Error(`Processing failed: ${res.statusText}`);
                return res.json();
              }),
            { retries: 5 },
          );

          const record = Record.parse(recordResponse);

          currentProgress += 1;
          const currentSession = get().session!;
          const updatedWithRecord = await persistSession({
            ...currentSession,
            records: [...currentSession.records, record],
          });
          set({
            session: updatedWithRecord,
            progress: Math.ceil((currentProgress / totalProgress) * 100),
          });
        }

        const finalSession = get().session!;
        const reviewSession = await persistSession({ ...finalSession, status: 'reviewing' });
        set({ session: reviewSession });
      } catch (error) {
        console.error('Error processing files:', error);
        toast.error('Error processing files. Please try again.');
      } finally {
        set({ isProcessing: false, processingFileName: '' });
      }
    },

    updateRecord: (index: number, record: Record) => {
      const session = get().session;
      if (!session) return;
      const records = session.records.map((r, i) => (i === index ? record : r));
      const updated = { ...session, records };
      set({ session: updated });
      persistSession(updated);
    },

    reprocess: async (index: number, model: string) => {
      const session = get().session;
      if (!session) return;

      set({ isReprocessing: true });
      try {
        const record = session.records[index];
        const request: ProcessRequest = {
          model,
          file: record.file,
          temperature: record.temperature,
        };
        const response = await fetch('/api/scriber', {
          method: 'POST',
          body: JSON.stringify(request),
        });
        if (!response.ok) throw new Error(`Reprocess failed: ${response.statusText}`);
        const json = await response.json();
        const newRecord = Record.parse(json);
        const records = session.records.map((r, i) => (i === index ? newRecord : r));
        const updated = await persistSession({ ...session, records });
        set({ session: updated });
      } catch (error) {
        console.error('Error reprocessing record:', error);
        toast.error('Error reprocessing record. Try a different model.');
      } finally {
        set({ isReprocessing: false });
      }
    },

    nextRecord: () => {
      const session = get().session;
      if (!session) return;
      const newIndex = Math.min(session.currentRecordIndex + 1, session.records.length - 1);
      const updated = { ...session, currentRecordIndex: newIndex };
      set({ session: updated });
      persistSession(updated);
    },

    prevRecord: () => {
      const session = get().session;
      if (!session) return;
      const newIndex = Math.max(session.currentRecordIndex - 1, 0);
      const updated = { ...session, currentRecordIndex: newIndex };
      set({ session: updated });
      persistSession(updated);
    },

    setModel: (model: string) => {
      const session = get().session;
      if (!session) return;
      const updated = { ...session, model };
      set({ session: updated });
      persistSession(updated);
    },

    setTemperature: (temperature: number) => {
      const session = get().session;
      if (!session) return;
      const updated = { ...session, temperature };
      set({ session: updated });
      persistSession(updated);
    },

    finishSession: () => {
      const session = get().session;
      if (!session) return;
      const updated = { ...session, status: 'completed' as const };
      set({ session: updated });
      persistSession(updated);
    },

    downloadZip: async () => {
      const session = get().session;
      if (!session) return;
      await downloadSessionZip(session.records, session.name);
    },
  }));
};
