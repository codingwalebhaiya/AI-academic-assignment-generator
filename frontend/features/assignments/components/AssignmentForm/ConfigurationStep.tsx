"use client";

import { FileUp, Calendar, Plus } from "lucide-react";
import QuestionTypeItem from "./QuestionTypeItem";
import { useState } from "react";

interface QuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

interface ConfigurationStepProps {
    file: File | null;
    setFile: (file: File | null) => void;
    subject: string;
    setSubject: (subject: string) => void;
    grade: string;
    setGrade: (grade: string) => void;
    testDuration: string;
    setTestDuration: (testDuration: string) => void;
    dueDate: string;
    setDueDate: (date: string) => void;
    additionalInstructions: string;
    setAdditionalInstructions: (instructions: string) => void;
    questionTypes: QuestionType[];
    addQuestionType: () => void;
    updateQuestionType: (index: number, field: string, value: any) => void;
    handleIncrement: (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => void;
    handleDecrement: (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => void;
    removeQuestionType: (index: number) => void;
}

export default function ConfigurationStep({
    file,
    setFile,
    subject,
    setSubject,
    grade,
    setGrade,
    testDuration,
    setTestDuration,
    dueDate,
    setDueDate,
    additionalInstructions,
    setAdditionalInstructions,
    questionTypes,
    addQuestionType,
    updateQuestionType,
    handleIncrement,
    handleDecrement,
    removeQuestionType,
}: ConfigurationStepProps) {

    const [isDragging, setIsDragging] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/pdf") {
            setFile(droppedFile);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
        }
    };

    const subjectOptions = [
        { value: "Math", label: "Math" },
        { value: "Science", label: "Science" },
        { value: "English", label: "English" },
        { value: "History", label: "History" },
        { value: "Geography", label: "Geography" },
        { value: "Computer Science", label: "Computer Science" },
        { value: "Physics", label: "Physics" },
        { value: "Chemistry", label: "Chemistry" },
        { value: "Biology", label: "Biology" },
        { value: "Other", label: "Other" },
    ];

    const classLevelOptions = [
        { value: "Class 1", label: "Class 1" },
        { value: "Class 2", label: "Class 2" },
        { value: "Class 3", label: "Class 3" },
        { value: "Class 4", label: "Class 4" },
        { value: "Class 5", label: "Class 5" },
        { value: "Class 6", label: "Class 6" },
        { value: "Class 7", label: "Class 7" },
        { value: "Class 8", label: "Class 8" },
        { value: "Class 9", label: "Class 9" },
        { value: "Class 10", label: "Class 10" },
        { value: "Class 11", label: "Class 11" },
        { value: "Class 12", label: "Class 12" },
        { value: "Other", label: "Other" },
    ];

    const assignmentDurationOptions = [
        { value: "1 hour", label: "1 hour" },
        { value: "2 hours", label: "2 hours" },
        { value: "3 hours", label: "3 hours" },
        { value: "4 hours", label: "4 hours" },
        { value: "Other", label: "Other" },
    ];

    return (
        <div className="max-w-2xl w-full mx-auto space-y-10 py-6">
            {/* FILE UPLOAD & DATE ROW (VERTICAL ON ALL) */}
            <div className="space-y-8 w-full">
                {/* SECTION 1: CORE DETAILS */}
                <div className="bg-card/50 backdrop-blur-md rounded-[2rem] p-8 border border-border shadow-sm space-y-8 w-full">
                    {/* FILE UPLOAD */}
                    <div className="space-y-4 text-center sm:text-left">
                        <div className="flex items-center gap-3 mb-2 px-1 text-foreground">
                            <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                                <FileUp size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Source Syllabus</h3>
                        </div>

                        <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[1.5rem] cursor-pointer bg-muted/50 hover:bg-card hover:border-primary transition-all duration-300">
                            <div className="flex flex-col items-center justify-center p-6 text-center text-foreground">
                                {file ? (
                                    <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FileUp size={32} />
                                        </div>
                                        <p className="text-md font-bold truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">File Selected Successfully</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-card shadow-sm border border-border text-muted-foreground rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-primary transition-all duration-300">
                                            <FileUp size={32} />
                                        </div>
                                        <p className="text-md font-bold">Drop syllabus PDF here</p>
                                        <p className="text-sm text-muted-foreground mt-1">or click to browse your files</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) setFile(e.target.files[0]);
                                }}
                            />
                        </label>
                    </div>

                    {/* subject and classLevel and assignmentDuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                value={subject}

                                onChange={(e) => setSubject(e.target.value)}
                                className="mt-1 block w-full p-2 bg-muted/30 rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground"
                            />
                        </div>
                        <div>
                            <label htmlFor="classLevel" className="block text-sm font-medium text-muted-foreground">Class Level</label>
                            <input
                                type="text"
                                id="grade"
                                value={grade}
                                onChange={(e) => setGrade(e.target.value)}
                                className="mt-1 block w-full p-2 bg-muted/30 rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground"
                            />
                        </div>
                        <div>
                            <label htmlFor="assignmentDuration" className="block text-sm font-medium text-muted-foreground">Assignment Duration</label>
                            <input
                                type="text"
                                id="testDuration"
                                value={testDuration}
                                onChange={(e) => setTestDuration(e.target.value)}
                                className="mt-1 block w-full p-2 bg-muted/30 rounded-md border-border shadow-sm focus:border-primary focus:ring-primary sm:text-sm text-foreground"
                            />
                        </div>
                    </div>



                    {/* DUE DATE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 px-1 text-foreground">
                            <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                                <Calendar size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Delivery Schedule</h3>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl border border-border bg-muted/50 focus-within:bg-card focus-within:ring-2 focus-within:ring-primary transition-all duration-300">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-transparent p-4 pl-12 outline-none text-foreground font-medium appearance-none"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: CONFIGURATION */}
                <div className="bg-card/50 backdrop-blur-md rounded-[2rem] p-8 border border-border shadow-sm space-y-6 w-full">
                    <div className="flex items-center justify-between px-1 text-foreground">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary text-primary-foreground rounded-xl">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Structure</h3>
                        </div>
                        <button
                            onClick={addQuestionType}
                            className="text-xs font-bold bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
                        >
                            <Plus size={16} /> Add Type
                        </button>
                    </div>

                    <div className="space-y-5">
                        {questionTypes.length > 0 ? (
                            questionTypes.map((qt, index) => (
                                <div key={index} className="animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                                    <QuestionTypeItem
                                        qt={qt}
                                        index={index}
                                        totalItems={questionTypes.length}
                                        onUpdate={updateQuestionType}
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement}
                                        onRemove={removeQuestionType}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
                                <p className="text-gray-400 font-medium">No question types added yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 3: ADDITIONAL INSTRUCTIONS */}
                <div className="bg-card/50 backdrop-blur-md rounded-[2rem] p-8 border border-border shadow-sm space-y-4 w-full">
                    <div className="flex items-center gap-3 mb-2 px-1 text-foreground">
                        <div className="p-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold flex items-center justify-center">✨</div>
                        <h3 className="text-lg font-bold">Pro Tips & Preferences</h3>
                    </div>
                    <textarea
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder="✨ Example: Focus on Quantum Physics • Medium difficulty • Include diagrams if possible..."
                        className="w-full bg-muted/50 border border-border p-5 rounded-2xl h-40 focus:ring-2 focus:ring-primary focus:bg-card outline-none transition-all resize-none text-foreground font-medium text-lg placeholder:text-muted-foreground/30"
                    />
                    <p className="text-xs text-muted-foreground font-medium px-2 italic">These instructions help our AI tailor the content to your specific needs.</p>
                </div>
            </div>
        </div>
    );

}

