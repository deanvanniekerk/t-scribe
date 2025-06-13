import type React from 'react';
import type { Record } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion } from '@radix-ui/react-accordion';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { useProcessStore } from '@/providers/process-store-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MODELS, TEMPS } from '@/lib/ai';
import { Input } from '@/components/ui/input';

type Props = {
  record: Record;
  index: number;
  totalRecords: number;
};

export const RecordForm: React.FC<Props> = ({ record, index, totalRecords }) => {
  const { prevRecord, nextRecord, updateRecord, reprocess, isReprocessing, downloadZip, reset } = useProcessStore(
    (state) => state,
  );

  const handleRecordFieldChange = (key: keyof Record, value: string | number) => {
    updateRecord(index, { ...record, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Record {index + 1} of {totalRecords}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-nowrap w-40">File Number:</span>
          <Input value={record.fileNumber} onChange={(e) => handleRecordFieldChange('fileNumber', e.target.value)} />
        </div>
        <div className="flex gap-2 pt-4 items-center">
          <span className="font-semibold text-nowrap w-40">Patient Name:</span>
          <Input value={record.patientName} onChange={(e) => handleRecordFieldChange('patientName', e.target.value)} />
        </div>
        <div className="flex gap-2 pt-4 items-center">
          <span className="font-semibold text-nowrap w-40">Referred By:</span>
          <Input value={record.referredBy} onChange={(e) => handleRecordFieldChange('referredBy', e.target.value)}
          />
        </div>
        {/* <p className="pt-4">
          <span className="font-semibold">Copy Doctors</span>: {record.copyDoctors}
        </p> */}
        <p className="pb-4  pt-4">
          <span className="font-semibold">Email: </span>
        </p>
        <Textarea
          value={record.emailBody}
          rows={14}
          autoComplete="off"
          onChange={(e) => handleRecordFieldChange('emailBody', e.target.value)}
        />
        <div className="flex w-full pt-4 justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              reprocess(index, record.model);
            }}
            loading={isReprocessing}
          >
            Try again
          </Button>
          <Select value={record.model} onValueChange={(value) => handleRecordFieldChange('model', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Model">{record.model}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={record.temperature?.toString()} onValueChange={(value) => handleRecordFieldChange('temperature', Number.parseFloat(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Temperature">{record.temperature}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TEMPS.map((temp) => (
                <SelectItem key={temp} value={temp}>
                  {temp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={reset}>
              {'Reset'}
            </Button>
            <Button onClick={downloadZip}>{'Download'}</Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={prevRecord}>
              {'< Previous'}
            </Button>
            <Button onClick={nextRecord}>{'Next >'}</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
