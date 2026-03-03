"use client";

import { useState, useCallback, useRef } from "react";
// Dynamic imports used inside handlers to avoid SSR issues with browser-only libs

type Mode = "pdf-to-text" | "text-to-pdf";

export default function Home() {
  const [mode, setMode] = useState<Mode>("pdf-to-text");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const { extractTextFromPdf } = await import("../lib/pdf-to-text");
      const extracted = await extractTextFromPdf(file);
      setText(extracted);
    } catch (err) {
      console.error(err);
      alert("Failed to extract text from PDF. The file may be scanned or image-based.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDownloadPdf = useCallback(async () => {
    if (!text.trim()) return;
    const { generatePdfFromText } = await import("../lib/text-to-pdf");
    generatePdfFromText(text);
  }, [text]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="text-center pt-10 pb-6 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          PDF Text Converter
        </h1>
        <p className="mt-3 text-slate-400 text-lg max-w-xl mx-auto">
          Convert PDF to Text and Text to PDF — fast, free, and 100% in your browser.
        </p>
      </header>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800 rounded-xl p-1 flex gap-1">
          <button
            onClick={() => { setMode("pdf-to-text"); setText(""); setFileName(""); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              mode === "pdf-to-text"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            PDF to Text
          </button>
          <button
            onClick={() => { setMode("text-to-pdf"); setText(""); setFileName(""); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              mode === "text-to-pdf"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Text to PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pb-16">
        {mode === "pdf-to-text" ? (
          <div className="space-y-6">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-blue-400 bg-blue-400/10"
                  : "border-slate-600 hover:border-slate-400 bg-slate-800/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="text-5xl mb-4">
                {loading ? (
                  <span className="inline-block animate-spin">&#9881;</span>
                ) : (
                  <span>&#128196;</span>
                )}
              </div>
              {loading ? (
                <p className="text-slate-300 text-lg">Extracting text...</p>
              ) : fileName ? (
                <p className="text-slate-300 text-lg">
                  <span className="text-blue-400 font-medium">{fileName}</span> — drop another to replace
                </p>
              ) : (
                <>
                  <p className="text-slate-300 text-lg font-medium">
                    Drop a PDF here or click to upload
                  </p>
                  <p className="text-slate-500 text-sm mt-2">
                    Supports any text-based PDF
                  </p>
                </>
              )}
            </div>

            {/* Extracted Text */}
            {text && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-200">
                    Extracted Text
                  </h2>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>
                <textarea
                  value={text}
                  readOnly
                  rows={16}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Text Input */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-200">
                Enter your text
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={16}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-300 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-600"
              />
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownloadPdf}
                disabled={!text.trim()}
                className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all ${
                  text.trim()
                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25 cursor-pointer"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                Download as PDF
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-sm">
        All processing happens in your browser. No data is sent to any server.
      </footer>
    </div>
  );
}
