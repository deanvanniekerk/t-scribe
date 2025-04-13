import { AudioToTextResponse, type ProcessRequest, Record } from '@/app/types';
import { MODELS } from '@/lib/ai';
import { createStore } from 'zustand/vanilla';

export type ProcessState = {
  files: FileList | null;
  isProcessing: boolean;
  progress: number;
  isReprocessing: boolean;
  records: Record[];
  currentRecordIndex: number;
  model: string;
};

export type ProcessActions = {
  uploadAudioFiles: (files: FileList) => Promise<void>;
  nextRecord: () => void;
  prevRecord: () => void;
  updateRecord: (index: number, record: Record) => void;
  setModel: (model: string) => void;
  reprocess: (index: number, model: string) => void;
};

export type ProcessStore = ProcessState & ProcessActions;

export const defaultInitState: ProcessState = {
  files: null,
  isProcessing: false,
  progress: 0,
  records: [],
  currentRecordIndex: 0,
  model: MODELS[0],
  isReprocessing: false,
};

export const createProcessStore = (initState: ProcessState = defaultInitState) => {
  return createStore<ProcessStore>()((set, get) => ({
    ...initState,
    setModel: (model) => {
      set({ model });
    },
    nextRecord: () => {
      set((state) => ({
        currentRecordIndex: Math.min(state.currentRecordIndex + 1, state.records.length - 1),
      }));
    },
    prevRecord: () => {
      set((state) => ({
        currentRecordIndex: Math.max(state.currentRecordIndex - 1, 0),
      }));
    },
    updateRecord: (index: number, record: Record) => {
      set((state) => ({
        records: state.records.map((r, i) => (i === index ? record : r)),
      }));
    },
    reprocess: async (index: number, model: string) => {
      set({ isReprocessing: true });
      const record = get().records[index];
      const request: ProcessRequest = {
        model,
        transcription: record.transcript,
      };
      const response = await fetch('/api/process', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      const json = await response.json();
      const processReponse = Record.parse(json);
      set((state) => ({
        records: state.records.map((r, i) => (i === index ? processReponse : r)),
        isReprocessing: false,
      }));
    },
    uploadAudioFiles: async (files: FileList) => {
      let currentProgress = 0;
      const totalProgress = files.length * 2;

      set({ files });

      set({ isProcessing: true, progress: 0, currentRecordIndex: 0 });

      for (const file of files) {
        const formData = new FormData();

        formData.append(file.name, file);

        const audioToTextResponse = await fetch('/api/audio-to-text', {
          method: 'POST',
          body: formData,
        });

        const [text] = AudioToTextResponse.parse(await audioToTextResponse.json());

        currentProgress += 1;
        set({
          progress: Math.ceil((currentProgress / totalProgress) * 100),
        });

        const request: ProcessRequest = {
          model: get().model,
          transcription: text.transcription,
        };

        const response = await fetch('/api/process', {
          method: 'POST',
          body: JSON.stringify(request),
        });

        const json = await response.json();
        const processReponse = Record.parse(json);

        currentProgress += 1;
        set({
          progress: Math.ceil((currentProgress / totalProgress) * 100),
        });

        set((state) => ({
          records: [...state.records, processReponse],
        }));
      }

      set({ isProcessing: false });
    },
  }));
};
