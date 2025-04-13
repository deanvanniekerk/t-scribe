'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useProcessStore } from '@/providers/process-store-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { RecordForm } from './RecordForm';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS } from '@/lib/ai';

// any because FileList is not supported in SSR
const formSchema = z.object({
  files: typeof window === 'undefined' ? z.any() : z.instanceof(FileList),
});

export const AudioFilesForm: React.FC = () => {
  const { uploadAudioFiles, records, isProcessing, currentRecordIndex, progress, model, setModel } = useProcessStore(
    (state) => state,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const fileRef = form.register('files');

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    uploadAudioFiles(data.files);
  };

  const record = useMemo(() => {
    return records[currentRecordIndex] ?? null;
  }, [records, currentRecordIndex]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pb-6">
        <FormField
          control={form.control}
          name="files"
          render={() => (
            <FormItem>
              <FormLabel>Transcripts</FormLabel>
              <FormControl>
                <Input type="file" multiple={true} {...fileRef} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between w-full">
          <Button type="submit" loading={isProcessing} disabled={isProcessing}>
            Start
          </Button>

          <Select value="{model}" onValueChange={setModel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Modal">{model}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>

      {isProcessing && <Progress value={progress} />}

      {record && !isProcessing && (
        <RecordForm record={record} index={currentRecordIndex} totalRecords={records.length} />
      )}
    </Form>
  );
};
