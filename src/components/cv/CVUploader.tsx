"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVUploaderProps {
  onFileSelected: (file: File) => void;
  isAnalyzing: boolean;
}

const MAX_SIZE_MB = 5;

export default function CVUploader({ onFileSelected, isAnalyzing }: CVUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setError(null);

    if (f.type !== "application/pdf") {
      setError("Hanya file PDF yang dapat dianalisis.");
      return;
    }

    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError("Ukuran CV maksimal 5MB.");
      return;
    }

    setFile(f);
    onFileSelected(f);
  }, [onFileSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
          }`}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <p className="font-bold text-slate-900 text-lg">Unggah CV kamu</p>
          <p className="text-slate-500 mt-2 text-sm">Drag & drop atau klik untuk memilih file</p>
          <p className="text-slate-400 mt-1 text-xs">Format PDF, maks {MAX_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-900 truncate">{file.name}</p>
            <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
          </div>
          {isAnalyzing && (
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
          )}
          {!isAnalyzing && (
            <button onClick={removeFile} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}
    </div>
  );
}
