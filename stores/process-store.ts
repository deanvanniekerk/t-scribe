import { AudioToTextResponse, type ProcessRequest, Record } from '@/app/types';
import { MODELS } from '@/lib/ai';
import { createStore } from 'zustand/vanilla';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { persist } from 'zustand/middleware';

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
  downloadZip: () => Promise<void>;
  reset: () => void;
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
  return createStore<ProcessStore>()(
    persist(
      (set, get) => ({
        ...initState,
        reset: () => {
          set({
            ...defaultInitState,
          });
        },
        downloadZip: async () => {
          const zip = new JSZip();

          const records = get().records;
          for (const record of records) {
            const fileName = `${record.fileNumber}_${record.patientName.replaceAll("'", '')}.txt`;
            zip.file(fileName, record.emailBody); // Add file to zip
          }

          // Generate the zip file asynchronously
          const zipBlob = await zip.generateAsync({ type: 'blob' });

          // Use file-saver to trigger the download
          const today = new Date();
          const dateStr = today.toLocaleDateString('en-GB').split('/').join('');
          saveAs(zipBlob, `transcripts_${dateStr}.zip`);
        },
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

          try {
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
            }));
          } catch (error) {
            console.error('Error reprocessing record:', error);
            toast.error('Error reprocessing record. Try a different model.', {
              position: 'top-center',
            });
          } finally {
            set({ isReprocessing: false });
          }
        },
        uploadAudioFiles: async (files: FileList) => {
          let currentProgress = 0;
          const totalProgress = files.length * 2;

          set({ files });

          try {
            set({ isProcessing: true, progress: 0, currentRecordIndex: 0, records: [] });

            for (const file of files) {
              const formData = new FormData();

              formData.append(file.name, file);

              const audioToTextResponse = await fetch('/api/scriber', {
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
          } catch (error) {
            console.error('Error reprocessing record:', error);
            toast.error('Error reprocessing record. Try a different model.', {
              position: 'top-center',
            });
          } finally {
            set({ isProcessing: false });
          }
        },
      }),
      {
        name: 'process-store',
      },
    ),
  );
};
