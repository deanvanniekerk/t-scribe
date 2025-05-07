import type { AudioToTextResponse } from '@/app/types';
import { NextResponse } from 'next/server';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { limiter } from '@/lib/queue';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const POST = async (req: Request) => {
  const formData = await req.formData();

  const response: AudioToTextResponse = [];

  for (const fileEntry of formData.values()) {
    console.log(fileEntry);
    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });
    }

    const filename = fileEntry.name;

    const myfile = await ai.files.upload({
      file: fileEntry,
    });

    if (!myfile.uri || !myfile.mimeType)
      return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });

    const result = await limiter.schedule(() =>
      ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: createUserContent([
          createPartFromUri(myfile.uri ?? '', myfile.mimeType ?? ''),
          'Generate a transcript of the Ophthalmologist doctors notes after a consult with patient. Expect medical terminology.',
        ]),
      }),
    );

    response.push({
      fileName: filename,
      transcription: result.text ?? '',
    });
  }

  return NextResponse.json(response);
};
