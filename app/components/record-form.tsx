'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSessionStore } from '@/providers/session-store-provider';
import { MODELS } from '@/lib/ai';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Hash, User, UserCheck } from 'lucide-react';

const formSchema = z.object({
  fileNumber: z.string(),
  patientName: z.string(),
  referredBy: z.string(),
  emailBody: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function RecordForm({ index }: { index: number }) {
  const session = useSessionStore((s) => s.session);
  const updateRecord = useSessionStore((s) => s.updateRecord);
  const reprocess = useSessionStore((s) => s.reprocess);
  const isReprocessing = useSessionStore((s) => s.isReprocessing);

  const record = session?.records[index];

  const { register, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: record
      ? {
          fileNumber: record.fileNumber,
          patientName: record.patientName,
          referredBy: record.referredBy,
          emailBody: record.emailBody,
        }
      : undefined,
  });

  useEffect(() => {
    if (record) {
      reset({
        fileNumber: record.fileNumber,
        patientName: record.patientName,
        referredBy: record.referredBy,
        emailBody: record.emailBody,
      });
    }
  }, [record, reset]);

  useEffect(() => {
    const subscription = watch((values) => {
      if (record && values.fileNumber !== undefined) {
        updateRecord(index, {
          ...record,
          fileNumber: values.fileNumber ?? '',
          patientName: values.patientName ?? '',
          referredBy: values.referredBy ?? '',
          emailBody: values.emailBody ?? '',
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, record, index, updateRecord]);

  if (!record) return null;

  return (
    <div className="space-y-5">
      {/* Metadata fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="fileNumber" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="h-3 w-3" />
            File Number
          </Label>
          <Input id="fileNumber" {...register('fileNumber')} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="patientName" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            Patient Name
          </Label>
          <Input id="patientName" {...register('patientName')} className="bg-background" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="referredBy" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <UserCheck className="h-3 w-3" />
            Referred By
          </Label>
          <Input id="referredBy" {...register('referredBy')} className="bg-background" />
        </div>
      </div>

      {/* Email body */}
      <div className="space-y-2">
        <Label htmlFor="emailBody" className="text-xs text-muted-foreground">
          Email Body
        </Label>
        <Textarea
          id="emailBody"
          rows={14}
          className="bg-background text-sm leading-relaxed"
          {...register('emailBody')}
        />
      </div>

      {/* Reprocess controls */}
      <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/30 p-3">
        <span className="text-xs font-medium text-muted-foreground">Reprocess:</span>
        <Select defaultValue={record.model} onValueChange={(model) => reprocess(index, model)}>
          <SelectTrigger className="w-[200px] bg-background">
            <SelectValue placeholder="Select model..." />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={() => reprocess(index, record.model)} disabled={isReprocessing}>
          {isReprocessing ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
          Try Again
        </Button>
      </div>
    </div>
  );
}
