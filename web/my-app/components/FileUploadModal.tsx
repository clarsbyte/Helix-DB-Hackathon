"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface UploadResult {
  filename: string;
  status: "success" | "error";
  pdfId?: string;
  title?: string;
  connections?: number;
  error?: string;
}

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FileUploadModal({ isOpen, onClose }: FileUploadModalProps) {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = "http://localhost:8000";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      setFiles(selectedFiles);
      setResults([]);
    }
  };

  const uploadSingleFile = async (file: File, index: number): Promise<UploadResult> => {
    try {
      setCurrentFileIndex(index);

      // Step 1: Upload file to S3 via server
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user?.userId || "anonymous");

      const uploadResponse = await fetch(`${API_BASE_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }

      const uploadData = await uploadResponse.json();

      if (uploadData.status !== "success") {
        throw new Error(uploadData.message || "Upload failed");
      }

      // Step 2: Process the uploaded PDF using the S3 key
      const processResponse = await fetch(`${API_BASE_URL}/process-pdf/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3_key: uploadData.s3_key,
          user_id: user?.userId || "anonymous",
        }),
      });

      if (!processResponse.ok) {
        throw new Error(`Processing failed with status: ${processResponse.status}`);
      }

      const data = await processResponse.json();

      if (data.status === "success") {
        return {
          filename: file.name,
          status: "success",
          pdfId: data.pdf_id,
          title: data.title,
          connections: data.connections_found || 0,
        };
      } else {
        return {
          filename: file.name,
          status: "error",
          error: data.message || "Processing error",
        };
      }
    } catch (error) {
      return {
        filename: file.name,
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      };
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setResults([]);
    setCurrentFileIndex(null);

    const uploadResults: UploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const result = await uploadSingleFile(files[i], i);
      uploadResults.push(result);
      setResults([...uploadResults]);

      // Small delay between uploads to avoid overwhelming the server
      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setUploading(false);
    setCurrentFileIndex(null);
  };

  const handleClose = () => {
    if (!uploading) {
      setFiles([]);
      setResults([]);
      setCurrentFileIndex(null);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles(droppedFiles);
    setResults([]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const totalConnections = results.reduce((sum, r) => sum + (r.connections || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#05070d] shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Batch Upload PDFs to Helix</h2>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: "calc(90vh - 180px)" }}>
          {/* File Selection Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mb-6 rounded-xl border-2 border-dashed border-white/20 bg-white/5 p-8 text-center transition hover:border-emerald-400/50 hover:bg-white/10"
          >
            <div className="mb-4 text-4xl">📄</div>
            <p className="mb-2 text-lg font-semibold text-white">
              Drag & drop PDF files here
            </p>
            <p className="mb-4 text-sm text-slate-400">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                      currentFileIndex === index
                        ? "bg-emerald-500/20 ring-1 ring-emerald-400/50"
                        : "bg-white/5"
                    }`}
                  >
                    <span className="truncate text-sm text-slate-200">{file.name}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Button */}
          {files.length > 0 && !uploading && results.length === 0 && (
            <button
              onClick={handleUpload}
              className="w-full rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-emerald-950 shadow-[0_14px_45px_rgba(16,185,129,0.35)] transition hover:scale-[1.02]"
            >
              Upload {files.length} File{files.length > 1 ? "s" : ""}
            </button>
          )}

          {/* Progress */}
          {uploading && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-300">
                  Processing {(currentFileIndex || 0) + 1} of {files.length}...
                </span>
                <span className="text-emerald-400">
                  {Math.round(((results.length) / files.length) * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 transition-all duration-500"
                  style={{
                    width: `${(results.length / files.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Results Summary */}
          {results.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{successCount}</div>
                <div className="text-xs text-slate-400">Successful</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{errorCount}</div>
                <div className="text-xs text-slate-400">Failed</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{totalConnections}</div>
                <div className="text-xs text-slate-400">Connections</div>
              </div>
            </div>
          )}

          {/* Results List */}
          {results.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                Results
              </h3>
              <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`rounded-lg border p-3 ${
                      result.status === "success"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : "border-red-500/30 bg-red-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg ${
                              result.status === "success" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {result.status === "success" ? "✅" : "❌"}
                          </span>
                          <span className="font-medium text-white">{result.filename}</span>
                        </div>
                        {result.status === "success" ? (
                          <div className="mt-2 space-y-1 text-xs text-slate-300">
                            <div>Title: {result.title}</div>
                            <div>PDF ID: {result.pdfId}</div>
                            <div>Connections: {result.connections}</div>
                          </div>
                        ) : (
                          <div className="mt-2 text-xs text-red-300">Error: {result.error}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Server: {API_BASE_URL}
            </p>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="rounded-lg border border-white/14 bg-white/6 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
