"use client";

import { Download, Loader2, ExternalLink, FileText, AlertCircle } from "lucide-react";
import { useAssignment } from "@/features/assignments/hooks/useAssignments";
import { useState, useEffect, use } from "react";


export default function AssignmentOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: assignment, isLoading, error } = useAssignment(id);
  const pdfUrl = assignment?.generatedPdfUrl;

  // iOS Safari cannot render PDFs inside <iframe> — detect it to show fallback UI
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  const handleDownload = async () => {
    if (!pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `assignment-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-gray-50">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="text-gray-500 text-sm">Loading assignment...</p>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-2">
          <AlertCircle size={32} />
        </div>
        <p className="text-red-600 font-bold text-lg">{(error as any)?.message || "PDF unavailable"}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b shadow-sm flex-shrink-0">
        <h1 className="font-bold text-base sm:text-lg text-gray-800 truncate mr-4">
          Assignment Preview
        </h1>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* On mobile also show "Open" since iframe doesn't work on iOS */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-indigo-600 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition sm:hidden"
          >
            <ExternalLink size={14} /> Open
          </a>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>
      </div>

      {/* ── PDF Viewer ── */}
      {isIOS ? (
        // iOS Safari fallback — iframes cannot embed PDFs on iOS
        <div className="flex flex-col items-center justify-center flex-1 gap-6 px-6 py-12 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <FileText size={40} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">PDF Ready</h2>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              iOS Safari doesn&apos;t support inline PDF preview. Use the buttons below to view or save the file.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 px-4 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition"
            >
              <ExternalLink size={18} /> Open PDF
            </a>
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              <Download size={18} /> Download
            </button>
          </div>
        </div>
      ) : (
        // Desktop & Android — iframe works fine
        <div className="flex-1 w-full relative">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            title="Assignment PDF"
          />
        </div>
      )}
    </div>
  );
}