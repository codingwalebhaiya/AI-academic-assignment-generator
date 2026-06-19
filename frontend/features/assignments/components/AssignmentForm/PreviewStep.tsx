"use client";

import { CheckCircle2 } from "lucide-react";

interface QuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

interface PreviewStepProps {
    file: File | null;
    subject: string;
    grade:string;
    testDuration: string;
    dueDate: string;
    additionalInstructions: string;
    questionTypes: QuestionType[];
}

export default function PreviewStep({
    file,
    subject,
    grade,
    testDuration,
    dueDate,
    additionalInstructions,
    questionTypes,
}: PreviewStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6 border border-border rounded-2xl p-6 bg-muted/30">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="text-emerald-500" size={20} /> General Details
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Selected File</span>
                            <span className="font-medium text-foreground truncate max-w-[200px]">{file?.name}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Subject</span>
                            <span className="font-medium text-foreground">{subject}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Grade</span>
                            <span className="font-medium text-foreground">{grade}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Test Duration</span>
                            <span className="font-medium text-foreground">{testDuration}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                            <span className="text-muted-foreground">Due Date</span>
                            <span className="font-medium text-foreground">{dueDate}</span>
                        </div>
                        <div className="space-y-2 py-2">
                            <span className="text-muted-foreground">Additional Instructions</span>
                            <p className="text-sm p-3 bg-card border border-border rounded-lg text-foreground min-h-[80px]">
                                {additionalInstructions || "No instructions provided."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 border border-border rounded-2xl p-6 bg-muted/30">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                        <CheckCircle2 className="text-emerald-500" size={20} /> Question Config
                    </h3>
                    <div className="space-y-3">
                        {questionTypes.map((qt, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-card border border-border rounded-xl shadow-sm">
                                <div>
                                    <p className="font-bold text-foreground">{qt.questionType}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {qt.numberOfQuestions} questions • {qt.marksPerQuestion} marks each
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">Total</p>
                                    <p className="text-lg font-black text-primary">{qt.numberOfQuestions * qt.marksPerQuestion}</p>
                                </div>
                            </div>
                        ))}
                        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                            <div className="space-y-1">
                                <span className="block font-bold text-muted-foreground text-xs">Total Questions</span>
                                <span className="text-2xl font-black text-foreground">
                                    {questionTypes.reduce((acc, curr) => acc + curr.numberOfQuestions, 0)}
                                </span>
                            </div>
                            <div className="space-y-1 text-right">
                                <span className="block font-bold text-muted-foreground text-xs">Total Marks</span>
                                <span className="text-2xl font-black text-primary">
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
