import { FileUploadResponse, type AudioToTextResponse } from '@/app/types';
import { NextResponse } from 'next/server';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const POST = async (req: Request) => {
  const data = FileUploadResponse.parse(await req.json());

  const file = data[0];

  const response: AudioToTextResponse = [];

  console.log('generating transcript', file.fileUri);
  const result = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-04-17',
    contents: createUserContent([
      createPartFromUri(file.fileUri, file.mimeType),
      'Generate a transcript of the Ophthalmologist doctors notes after a consult with patient. Expect medical terminology.',
    ]),
  });

  response.push({
    fileName: file.fileName,
    transcription: result.text ?? '',
  });

  return NextResponse.json(response);
};
