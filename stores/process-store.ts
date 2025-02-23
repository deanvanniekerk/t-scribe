import { AudioToTextResponse, type ProcessRequest, ProcessResponse } from '@/app/types';
import { createStore } from 'zustand/vanilla';

export type ProcessState = {
  files: FileList | null;
  isProcessing: boolean;
  records: ProcessResponse[];
  currentRecordIndex: number;
};

export type ProcessActions = {
  uploadAudioFiles: (files: FileList) => Promise<void>;
};

export type ProcessStore = ProcessState & ProcessActions;

export const defaultInitState: ProcessState = {
  files: null,
  isProcessing: false,
  records: [],
  currentRecordIndex: 0,
};

export const createProcessStore = (initState: ProcessState = defaultInitState) => {
  return createStore<ProcessStore>()((set) => ({
    ...initState,
    uploadAudioFiles: async (files: FileList) => {
      set({ files });

      set({ isProcessing: true });

      const formData = new FormData();

      for (const file of files) formData.append(file.name, file);

      const response = await fetch('/api/audio-to-text', {
        method: 'POST',
        body: formData,
      });

      const json = await response.json();
      const audioToTextReponse = AudioToTextResponse.parse(json);

      for (const text of audioToTextReponse) {
        const request: ProcessRequest = {
          model: 'qwen-2.5-32b',
          transcription: text.transcription,
        };

        const response = await fetch('/api/process', {
          method: 'POST',
          body: JSON.stringify(request),
        });

        const json = await response.json();
        const processReponse = ProcessResponse.parse(json);

        set((state) => ({
          records: [...state.records, processReponse],
        }));
      }

      set({ isProcessing: false });
    },
  }));
};
