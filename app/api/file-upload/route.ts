import type { FileUploadResponse } from '@/app/types';
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const POST = async (req: Request) => {
  const formData = await req.formData();

  const response: FileUploadResponse = [];

  for (const fileEntry of formData.values()) {
    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });
    }

    const filename = fileEntry.name;

    console.log('uploading file', filename);
    const myfile = await ai.files.upload({
      file: fileEntry,
    });

    if (!myfile.uri || !myfile.mimeType)
      return NextResponse.json({ error: 'No file provided or file is not valid.' }, { status: 400 });

    response.push({
      fileUri: myfile.uri,
      mimeType: myfile.mimeType,
      fileName: filename,
    });
  }

  return NextResponse.json(response);
};
