import { NextResponse } from 'next/server';
import { groq } from '../groq';

export const POST = async (req: Request, _res: Response) => {
  const formData = await req.formData();
  const fileEntry = formData.get('file');

  if (!(fileEntry instanceof File)) {
    return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });
  }

  const filename = fileEntry.name.replaceAll(' ', '_');

  console.log(filename);

  try {
    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
      file: fileEntry,
      // https://console.groq.com/docs/speech-text
      model: 'whisper-large-v3-turbo', // better, bit more exp
      // model: 'distil-whisper-large-v3-en',
      prompt: 'Ophthalmologist doctors notes after consult with patient',
      response_format: 'json', // Optional
      language: 'en', // Optional
      temperature: 0.0, // Optional
    });

    // Log the transcribed text
    console.log(transcription.text);

    return NextResponse.json({ transcription: transcription.text, status: 200 });
  } catch (error) {
    console.log('Error occurred ', error);
    return NextResponse.json({ Message: 'Failed', status: 500 });
  }
};
