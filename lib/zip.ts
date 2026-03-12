import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Record } from '@/app/types';

export async function downloadSessionZip(records: Record[], sessionName?: string): Promise<void> {
  const zip = new JSZip();

  for (const record of records) {
    const fileNumber = record.fileNumber.trim();
    const patientName = record.patientName.replaceAll("'", '').trim();
    const referredBy = record.referredBy.replaceAll("'", '').trim();
    const fileName = `${fileNumber}_${patientName}_${referredBy}.txt`;
    zip.file(fileName, record.emailBody);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const dateStr = new Date().toLocaleDateString('en-GB').split('/').join('');
  const zipName = sessionName ? `${sessionName.replaceAll(' ', '_')}_${dateStr}.zip` : `transcripts_${dateStr}.zip`;
  saveAs(zipBlob, zipName);
}
