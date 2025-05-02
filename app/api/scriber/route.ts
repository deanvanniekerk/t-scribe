import type { AudioToTextResponse } from '@/app/types';
import { NextResponse } from 'next/server';
import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';

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

    // Create a transcription job
    // const transcription = await groq.audio.transcriptions.create({
    //   file: fileEntry,
    //   // https://console.groq.com/docs/speech-text
    //   model: 'whisper-large-v3-turbo', // better, bit more exp
    //   // model: 'distil-whisper-large-v3-en',
    //   prompt: 'Ophthalmologist doctors notes after a consult with patient. Expect medical terminology.',
    //   response_format: 'json', // Optional
    //   language: 'en', // Optional
    //   temperature: 0.0, // Optional
    // });

    const myfile = await ai.files.upload({
      file: fileEntry,
    });

    if (!myfile.uri || !myfile.mimeType)
      return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        'Generate a transcript of the Ophthalmologist doctors notes after a consult with patient. Expect medical terminology.',
      ]),
    });

    response.push({
      fileName: filename,
      transcription: result.text ?? '',
    });
  }

  return NextResponse.json(response);
};
