import type React from 'react';
import type { Record } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion } from '@radix-ui/react-accordion';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { useProcessStore } from '@/providers/process-store-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS } from '@/lib/ai';

type Props = {
  record: Record;
  index: number;
  totalRecords: number;
};

export const RecordForm: React.FC<Props> = ({ record, index, totalRecords }) => {
  const { prevRecord, nextRecord, updateRecord, reprocess, isReprocessing } = useProcessStore((state) => state);

  const handleEmailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateRecord(index, { ...record, emailBody: e.target.value });
  };

  const handleModelChange = (model: string) => {
    updateRecord(index, { ...record, model: model });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Record {index + 1} of {totalRecords}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <p>
          <span className="font-semibold">File Number</span>: {record.fileNumber}
        </p>
        <p className="pt-4">
          <span className="font-semibold">Patient Name</span>: {record.patientName}
        </p>
        <p className="pt-4">
          <span className="font-semibold">Referring Doctor</span>: {record.referringDoctor}
        </p>
        <p className="pt-4">
          <span className="font-semibold">Copy Doctors</span>: {record.copyDoctors}
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="transcript">
            <AccordionTrigger>Original Transcript</AccordionTrigger>
            <AccordionContent>{record.transcript}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="pb-4">
          <span className="font-semibold">Email: </span>
        </p>
        <Textarea value={record.emailBody} rows={14} autoComplete="off" onChange={handleEmailChange} />
        <div className="flex w-full pt-4 justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              reprocess(index, record.model);
            }}
            loading={isReprocessing}
          >
            Reload
          </Button>
          <Select value="{model}" onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Modal">{record.model}</SelectValue>
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
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button variant="secondary" onClick={prevRecord}>
            {'< Previous'}
          </Button>
          <Button onClick={nextRecord}>{'Next >'}</Button>
        </div>
      </CardFooter>
    </Card>
  );
};
