"use client";

import { CheckCircle2 } from "lucide-react";

interface QuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

interface PreviewStepProps {
    file: File | null;
    dueDate: string;
    additionalInstructions: string;
    questionTypes: QuestionType[];
}

export default function PreviewStep({
    file,
    dueDate,
    additionalInstructions,
    questionTypes,
}: PreviewStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6 border rounded-2xl p-6 bg-gray-50/50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} /> General Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-500">Selected File</span>
                            <span className="font-medium text-black truncate max-w-[200px]">{file?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-500">Due Date</span>
                            <span className="font-medium text-black">{dueDate}</span>
                        </div>
                        <div className="space-y-2 py-2">
                            <span className="text-gray-500">Additional Instructions</span>
                            <p className="text-sm p-3 bg-white border rounded-lg text-black min-h-[80px]">
                                {additionalInstructions || "No instructions provided."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border rounded-2xl p-6 bg-gray-50/50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} /> Question Config
                    </h3>
                    <div className="space-y-3">
                        {questionTypes.map((qt, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm">
                                <div>
                                    <p className="font-bold text-black">{qt.questionType}</p>
                                    <p className="text-xs text-gray-500">
                                        {qt.numberOfQuestions} questions • {qt.marksPerQuestion} marks each
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-black">Total</p>
                                    <p className="text-lg font-black">{qt.numberOfQuestions * qt.marksPerQuestion}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <div className="space-y-1">
                                <span className="block font-bold text-gray-500 text-xs">Total Questions</span>
                                <span className="text-2xl font-black text-black">
                                    {questionTypes.reduce((acc, curr) => acc + curr.numberOfQuestions, 0)}
                                </span>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="block font-bold text-gray-500 text-xs">Total Marks</span>
                                <span className="text-2xl font-black text-black">
                                    {questionTypes.reduce((acc, curr) => acc + (curr.numberOfQuestions * curr.marksPerQuestion), 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
