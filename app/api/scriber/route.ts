import { ProcessRequest, Record } from '@/app/types';
import { NextResponse } from 'next/server';
import { GoogleGenAI, createUserContent, createPartFromUri, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export const POST = async (req: Request) => {
  const process = ProcessRequest.parse(await req.json());

  const file = process.file[0];

  const model = process.model;

  console.log('generating transcript', file.fileUri);

  const result = await ai.models.generateContent({
    model,
    contents: createUserContent([
      createPartFromUri(file.fileUri, file.mimeType),
      'Supplied is an audio file, generate a transcript of the Ophthalmologist doctors notes after a consult with patient. Expect medical terminology.',
      `I am a specialist ophtalmologist. 
I will provide you with my notes after a consult with a patient. 
I need you to create an email for the referring doctor or optometrist based upon my notes. 
Please format the email in a way that is medically professional and friendly. 
It is highly important that the email is grammatically correct and medically sound.
If there are obvious diagnoses, please include them in the email.
When starting the email address referring doctors and optometrists by their first name, if there is no first name, refer to doctor as "Dr {last name}" and optometrist as "Mr/Mrs {last name}".
Do not include the file number in the email.
End the email with "Thank you for your continued support." THERE SHOULD BE NO OTHER CLOSING REMARKS.
Do NOT include any other closing remarks like "Kind regards" or "Sincerely" or name.
Include paragraphs and line breaks in the email.
Extract the file number to the fileNumber field, patient name to the patientName field and referring doctor or optometrist to the referredBy field.
The email should be added to the emailBody field.`,
    ]),
    config: {
      temperature: process.temperature ?? 0.2,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ['emailBody', 'fileNumber', 'patientName', 'referredBy'],
        properties: {
          emailBody: {
            type: Type.STRING,
          },
          fileNumber: {
            type: Type.STRING,
          },
          patientName: {
            type: Type.STRING,
          },
          referredBy: {
            type: Type.STRING,
          },
        },
      },
    },
  });

  // console.log('transcript generated', file.fileUri, model, result.text);

  const response = Record.parse({
    model: process.model,
    file: process.file,
    temperature: process.temperature,
    ...JSON.parse(result.text ?? '{}'),
  });

  return NextResponse.json(response);
};
