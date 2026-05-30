"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Download } from "lucide-react";
import AssignmentPaper from "@/components/AssignmentOutput/AssignmentPaper";

interface Question {
  text: string;
  difficulty: string;
  marks: number;
}

interface Section {
  sectionName: string;
  title: string;
  instruction: string;
  questions: Question[];
}

interface AnswerSection{
  sectionName:string,
  questionNumber:number,
  answer:string
}

interface AssignmentData {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  sections: Section[];
  answerKey: AnswerSection[];
}

export default function AssignmentOutputPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<AssignmentData | null>(null);
  //console.log(data.answerKey)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/assignments/${id}`);
        setData(response.data.generatedContent);
      } catch (error) {
        console.error("Error fetching assignment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-white">
        <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin" />
        <p className="text-gray-500 font-medium font-mono">Synthesizing Assignment...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4">
          <p className="text-red-500 font-bold">Failed to load assignment data.</p>
          <button onClick={() => window.location.reload()} className="text-sm underline">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      {/* ACTION HEADER (TOP-LEFT DOWNLOAD AS REQUESTED) */}
      <div className="max-w-5xl mx-auto mb-6 flex justify-start items-center print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-gray-200 transition-all shadow-xl active:scale-95 border-2 border-transparent hover:border-black/10"
        >
          <Download size={18} /> Download as PDF
        </button>
      </div>

      <AssignmentPaper data={data} />



      {/* STYLES FOR PRINTING */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 2cm;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .min-h-screen {
            min-height: auto !important;
            padding: 0 !important;
          }
          .py-8 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .max-w-5xl {
            max-width: 100% !important;
            margin: 0 !important;
          }
          .shadow-\\[0_0_50px_rgba\\(0\\,0\\,0\\,0\\.3\\)\\] {
            box-shadow: none !important;
          }
          .rounded-\\[2\\.5rem\\] {
            border-radius: 0 !important;
          }
          .p-12, .p-20 {
            padding: 0 !important;
          }
          .italic {
            font-style: italic !important;
          }
          .border-b-2 {
            border-bottom-width: 1pt !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}