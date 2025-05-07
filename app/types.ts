import * as z from 'zod';

export type FileUploadResponse = z.infer<typeof FileUploadResponse>;
export const FileUploadResponse = z.array(
  z.object({
    fileUri: z.string(),
    mimeType: z.string(),
    fileName: z.string(),
  }),
);

export type AudioToTextResponse = z.infer<typeof AudioToTextResponse>;
export const AudioToTextResponse = z.array(
  z.object({
    fileName: z.string(),
    transcription: z.string(),
  }),
);

export type ProcessRequest = z.infer<typeof ProcessRequest>;
export const ProcessRequest = z.object({
  model: z.string(),
  transcription: z.string(),
});

export type Record = z.infer<typeof Record>;
export const Record = z.object({
  transcript: z.string(),
  emailBody: z.string(),
  fileNumber: z.string(),
  patientName: z.string(),
  referringDoctor: z.string(),
  copyDoctors: z.string(),
  model: z.string(),
});
