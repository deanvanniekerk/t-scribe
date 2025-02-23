'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProcessStore } from '@/providers/counter-store-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  files: z.instanceof(FileList),
});

export const AudioFilesForm: React.FC = () => {
  const { uploadAudioFiles, records, isProcessing } = useProcessStore((state) => state);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('files');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    uploadAudioFiles(data.files);
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
        <Button type="submit" loading={isProcessing}>
          Rip Audio to Text
        </Button>
      </form>

      {records.map((record, index) => (
        <div key={record.fileNumber} className="p-4 rounded-md">
          <h2 className="text-xl font-semibold">Record {index + 1}</h2>
          <p className="pt-2">File Number: {record.fileNumber}</p>
          <p className="pt-2">Patient Name: {record.patientName}</p>
          <p className="pt-2">Referring Doctor: {record.referringDoctor}</p>
          <p className="pt-2">Copy Doctors: {record.copyDoctors}</p>
          <p className="pt-2">Letter Body: {record.letterBody}</p>
          <p className="pt-4">Original Text: {record.originalText}</p>
        </div>
      ))}
    </Form>
  );
};
