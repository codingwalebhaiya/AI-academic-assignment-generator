"use client";

import { useEffect, useState, use } from "react";
import axios from "axios";
import { Download, Clock, Trophy } from "lucide-react";

interface Question {
    text: string;
    difficulty: string;
    marks: number;
}

interface Section {
    title: string;
    instruction: string;
    questions: Question[];
}

interface AssignmentData {
    schoolName: string;
    subject: string;
    className: string;
    timeAllowed: string;
    maximumMarks: number;
    sections: Section[];
}

export default function AssignmentOutputPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<AssignmentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/v1/assignments/${id}`);
                console.log(response)
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

            {/* QUESTION PAPER (THE PRINTABLE PART) */}
            <div className="max-w-5xl mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden print:shadow-none print:rounded-none">
                <div className="p-12 sm:p-20 space-y-12">

                    {/* ACADEMIC HEADER */}
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl font-black uppercase tracking-tight text-black leading-tight italic">
                            {data.schoolName || "Your School Name"}
                        </h1>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-800">Subject: {data.subject}</h2>
                            <h3 className="text-xl font-bold text-gray-700">Class: {data.className}</h3>
                        </div>

                        <div className="flex justify-between items-center pt-8 text-sm font-black uppercase tracking-widest text-black border-t-2 border-black/5">
                            <div className="flex items-center gap-2">
                                Time Allowed: {data.timeAllowed || ""}
                            </div>
                            <div className="flex items-center gap-2">
                                Maximum Marks: {data.maximumMarks || ""}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-gray-600 mt-4 italic">All questions are compulsory unless stated otherwise.</p>
                    </div>

                    {/* STUDENT INFO SECTION */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-20 gap-y-6 py-10 border-y-2 border-black/5">
                        <div className="flex items-end gap-3">
                            <span className="font-bold text-black whitespace-nowrap">Name:</span>
                            <div className="border-b-2 border-black/20 flex-1 h-6"></div>
                        </div>
                        <div className="flex items-end gap-3">
                            <span className="font-bold text-black whitespace-nowrap">Roll Number:</span>
                            <div className="border-b-2 border-black/20 flex-1 h-6"></div>
                        </div>
                        <div className="flex items-end gap-3 sm:col-span-2">
                            <span className="font-bold text-black whitespace-nowrap">Section:</span>
                            <div className="border-b-2 border-black/20 w-32 h-6"></div>
                        </div>
                    </div>

                    {/* SECTIONS & QUESTIONS */}
                    <div className="space-y-16">
                        {data.sections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-black inline-block uppercase tracking-widest text-black mb-4">
                                        {section.title || `Section ${String.fromCharCode(65 + sIdx)}`}
                                    </h3>
                                    <div className="space-y-1">
                                        <p className="text-lg font-bold text-gray-800">{section.title ? "" : "Short Answer Questions"}</p>
                                        <p className="text-sm text-gray-500 italic font-medium">{section.instruction || "Attempt all questions. Each question carries 2 marks"}</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {section.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="flex gap-4 items-start group">
                                            <span className="font-bold text-xl text-black min-w-[32px]">{qIdx + 1}.</span>
                                            <p className="text-xl leading-relaxed text-gray-900 flex-1">
                                                <span className="font-bold text-gray-500 mr-2">[{q.difficulty}]</span>
                                                {q.text}
                                                <span className="font-bold text-gray-500 ml-2">[{q.marks} Marks]</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* FOOTER */}
                    <div className="pt-20 text-center">
                        <p className="font-black text-black uppercase tracking-[0.5em] text-sm opacity-20">— End of Question Paper —</p>
                    </div>
                </div>
            </div>

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