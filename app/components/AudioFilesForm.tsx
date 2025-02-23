'use client';

import { Input } from '@/components/ui/input';
import type React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const formSchema = z.object({
  files: z.instanceof(FileList),
});

export const AudioFilesForm: React.FC = () => {
  const [rawText, setRawText] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('files');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);

    const formData = new FormData();
    formData.append('file', data.files[0]);

    fetch('/api/audio-to-text', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setRawText(data.transcription);
      })
      .catch((error) => console.error(error));
  };

  const onProcess = () => {
    fetch('/api/process', {
      method: 'POST',
      body: JSON.stringify({ prompt: rawText }),
    })
      .then((response) => response.json())
      .then((data) => {
        setProcessedText(data.processed);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormLabel>Transcripts</FormLabel>
              <FormControl>
                <Input type="file" placeholder="shadcn" {...fileRef} />
              </FormControl>
              <FormDescription>Upload tazza beautiful voice files.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Rip Audio to Text</Button>
      </form>
      <p className="pt-8">{rawText}</p>
      <Button
        onClick={() => {
          onProcess();
        }}
        className="mt-8"
      >
        Process
      </Button>
      <p className="pt-8">{processedText}</p>
    </Form>
  );
};
