import { NextResponse } from 'next/server';
import { groq } from '../groq';

export const POST = async (req: Request) => {
  const data = await req.json();

  try {
    const chat = await groq.chat.completions.create({
      model: 'qwen-2.5-32b',
      messages: [
        {
          role: 'user',
          content: `
I am a specialist ophtalmologist. 
I will provide you with my notes after a consult with a patient. 
I need to email the notes to the referring optometrist. 
Please format the notes in a way that is professional and easy to understand. 
Thank the optometrist for the referral and continued support.
I want your response to be in json format with the schema:

{
    "body": string;
    "fileNumber": string;
    "patientName": string;
    "referringDoctor": string;
}

`,
        },
        {
          role: 'user',
          content: data.prompt,
        },
      ],
      // max_tokens: 100,
      temperature: 0.0,
      stream: false,
    });

    console.log(chat);

    return NextResponse.json({ processed: chat.choices[0].message.content, status: 200 });
  } catch (error) {
    console.log('Error occurred ', error);
    return NextResponse.json({ Message: 'Failed', status: 500 });
  }
};
