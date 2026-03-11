import * as z from 'zod';

export type FileUploadResponse = z.infer<typeof FileUploadResponse>;
export const FileUploadResponse = z.array(
  z.object({
    fileUri: z.string(),
    mimeType: z.string(),
    fileName: z.string(),
  }),
);

export type ProcessRequest = z.infer<typeof ProcessRequest>;
export const ProcessRequest = z.object({
  temperature: z.number().optional(),
  model: z.string(),
  file: FileUploadResponse,
});

export type Record = z.infer<typeof Record>;
export const Record = z.object({
  emailBody: z.string(),
  fileNumber: z.string(),
  patientName: z.string(),
  referredBy: z.string(),
  model: z.string(),
  file: FileUploadResponse,
  temperature: z.number(),
});

export const SessionStatus = z.enum(['uploading', 'processing', 'reviewing', 'completed']);
export type SessionStatus = z.infer<typeof SessionStatus>;

export type Session = z.infer<typeof Session>;
export const Session = z.object({
  id: z.string(),
  name: z.string(),
  status: SessionStatus,
  records: z.array(Record),
  currentRecordIndex: z.number(),
  model: z.string(),
  temperature: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});
