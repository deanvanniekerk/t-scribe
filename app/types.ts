import * as z from 'zod';

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

export type ProcessResponse = z.infer<typeof ProcessResponse>;
export const ProcessResponse = z.object({
  originalText: z.string(),
  letterBody: z.string(),
  fileNumber: z.string(),
  patientName: z.string(),
  referringDoctor: z.string(),
  copyDoctors: z.string(),
});
