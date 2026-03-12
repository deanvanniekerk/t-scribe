'use client';

import { useRef, useState } from 'react';
import { useSessionStore } from '@/providers/session-store-provider';
import { MODELS, TEMPS } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileAudio, Sparkles, X } from 'lucide-react';

export function UploadStep() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const session = useSessionStore((s) => s.session);
  const uploadAndProcess = useSessionStore((s) => s.uploadAndProcess);
  const setModel = useSessionStore((s) => s.setModel);
  const setTemperature = useSessionStore((s) => s.setTemperature);

  const handleSubmit = () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    uploadAndProcess(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : selectedFiles && selectedFiles.length > 0
              ? 'border-primary/40 bg-primary/5'
              : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`rounded-2xl p-4 transition-all duration-300 ${
            selectedFiles && selectedFiles.length > 0 ? 'gradient-brand glow-sm' : 'bg-muted group-hover:gradient-brand-subtle'
          }`}>
            <Upload className={`h-8 w-8 transition-colors ${
              selectedFiles && selectedFiles.length > 0 ? 'text-white' : 'text-muted-foreground group-hover:text-primary'
            }`} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold">
              {selectedFiles && selectedFiles.length > 0
                ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} selected`
                : 'Drop audio files here or click to browse'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Supports MP3, M4A, WAV, and other audio formats</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {selectedFiles && selectedFiles.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card">
          <div className="border-b border-border/40 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Selected Files</p>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedFiles(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="divide-y divide-border/30">
            {Array.from(selectedFiles).map((file) => (
              <div key={file.name} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-brand-subtle">
                  <FileAudio className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 truncate text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <p className="mb-3 text-sm font-semibold">AI Settings</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Model</Label>
            <Select value={session?.model ?? MODELS[0]} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Temperature</Label>
            <Select
              value={String(session?.temperature ?? 0.2)}
              onValueChange={(v) => setTemperature(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        className="w-full gradient-brand glow-sm h-12 text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:opacity-40 disabled:hover:scale-100"
        size="lg"
        onClick={handleSubmit}
        disabled={!selectedFiles || selectedFiles.length === 0}
      >
        <Sparkles className="mr-2 h-4 w-4" />
        Start Processing
      </Button>
    </div>
  );
}
