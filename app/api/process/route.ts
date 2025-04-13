import { ProcessRequest, type Record } from '@/app/types';
import { NextResponse } from 'next/server';
import { groq } from '../groq';

export const POST = async (req: Request) => {
  const data = ProcessRequest.parse(await req.json());

  const chat = await groq.chat.completions.create({
    model: data.model,
    messages: [
      {
        role: 'user',
        content: `
I am a specialist ophtalmologist. 
I will provide you with my notes after a consult with a patient. 
I need your to create an email for the referring doctor or optometrist based apon my notes. 
Please format the email in a way that is medically professional and clear. 
It is highly important that the email is grammatically correct and medically sound.
Extract the file number, patient name, referring doctor and copy doctors from the notes.
There are not always copy doctors, so if there are none, leave the field empty.
When starting the email address referring doctors and optometrists by their first name, if there is no first name, refer to doctor as "Dr {last name}" and optometrist as "Mr/Mrs {last name}".
Do not include the file number in the email.
End the email with "Thank you for your continued support."
Do no include any other closing remarks like "Kind regards" or "Sincerely" or name.
Include paragraphs and line breaks in the email.
I want your response to be in json format with the schema:

{
  "emailBody": string;
  "fileNumber": string;
  "patientName": string;
  "referringDoctor": string;
  "copyDoctors": string;
}

`,
      },
      {
        role: 'user',
        content: data.transcription,
      },
    ],
    // max_tokens: 100,
    temperature: 0.0,
    stream: false,
    response_format: { type: 'json_object' },
  });

  // console.log(chat.choices[0].message.content);

  const response = {
    transcript: data.transcription,
    model: data.model,
    ...JSON.parse(chat.choices[0].message.content ?? ''),
  } satisfies Record;

  return NextResponse.json(response);
};
