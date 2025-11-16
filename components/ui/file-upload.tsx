"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, Download } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string;
  maxSize?: number;
  currentFile?: File | null;
  onClear?: () => void;
}

export function FileUpload({
  onFileSelect,
  acceptedFormats = ".csv,.xlsx,.xls",
  maxSize = 50,
  currentFile,
  onClear,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxSize} MB`;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    const accepted = acceptedFormats.split(",").map((f) => f.replace(".", "").trim());
    
    if (extension && !accepted.includes(extension)) {
      return `Invalid file format. Accepted: ${acceptedFormats}`;
    }

    return null;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      setError(null);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0];
        const validationError = validateFile(file);
        
        if (validationError) {
          setError(validationError);
        } else {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect, maxSize, acceptedFormats]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const validationError = validateFile(file);
      
      if (validationError) {
        setError(validationError);
      } else {
        onFileSelect(file);
      }
    }
  };

  const handleClear = () => {
    setError(null);
    if (onClear) onClear();
  };

  if (currentFile) {
    return (
      <div className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentFile.name}</p>
              <p className="text-xs text-slate-400">
                {(currentFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 hover:text-white" />
          </button>
        </div>
        <div className="mt-3 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-full bg-emerald-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer",
          isDragging
            ? "border-purple-500 bg-purple-500/5"
            : "border-slate-700 hover:border-slate-600 bg-slate-900/50"
        )}
      >
        <input
          type="file"
          accept={acceptedFormats}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
            <Upload className={cn(
              "w-6 h-6 transition-colors",
              isDragging ? "text-purple-500" : "text-slate-400"
            )} />
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-white mb-1">
              Create or import a custom classification
            </p>
            <p className="text-xs text-slate-400">
              Maximum file size: {maxSize} MB
            </p>
            <p className="text-xs text-slate-500">
              Supported format: {acceptedFormats.toUpperCase().replace(/\./g, "")}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}

interface TemplateDownloadProps {
  fileName: string;
  fileSize: string;
  fileType: string;
  onDownload: () => void;
}

export function TemplateDownload({
  fileName,
  fileSize,
  fileType,
  onDownload,
}: TemplateDownloadProps) {
  return (
    <div className="w-full p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-slate-900 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{fileName}</p>
            <p className="text-xs text-slate-400">
              {fileType} · {fileSize}
            </p>
          </div>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-xs text-white"
        >
          <Download className="w-3 h-3" />
          Download
        </button>
      </div>
    </div>
  );
}

