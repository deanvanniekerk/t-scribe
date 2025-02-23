import type { AudioToTextResponse } from '@/app/types';
import { NextResponse } from 'next/server';
import { groq } from '../groq';

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
    const transcription = await groq.audio.transcriptions.create({
      file: fileEntry,
      // https://console.groq.com/docs/speech-text
      model: 'whisper-large-v3-turbo', // better, bit more exp
      // model: 'distil-whisper-large-v3-en',
      prompt: 'Ophthalmologist doctors notes after consult with patient. Except medical terminology.',
      response_format: 'json', // Optional
      language: 'en', // Optional
      temperature: 0.0, // Optional
    });

    response.push({
      fileName: filename,
      transcription: transcription.text,
    });
  }

  return NextResponse.json(response);
};
