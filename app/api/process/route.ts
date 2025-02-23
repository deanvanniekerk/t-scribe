import { ProcessRequest, type ProcessResponse } from '@/app/types';
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
I need your to create an email for the referring doctor based apon my notes. 
Please format the email in a way that is medically professional and clear. 
End the email by thanking the doctor for the referral and continued support.
It is highly important that the email is grammatically correct and medically sound.
It is possible that there are addition doctors that need to be copied on the email.
I want your response to be in json format with the schema:

{
  "letterBody": string;
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

  console.log(chat.choices[0].message.content);

  const response = {
    originalText: data.transcription,
    ...JSON.parse(chat.choices[0].message.content ?? ''),
  } satisfies ProcessResponse;

  return NextResponse.json(response);
};
