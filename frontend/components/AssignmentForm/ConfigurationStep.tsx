"use client";

import { FileUp, Calendar, Plus } from "lucide-react";
import QuestionTypeItem from "./QuestionTypeItem";

interface QuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

interface ConfigurationStepProps {
    file: File | null;
    setFile: (file: File | null) => void;
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
    return (
        <div className="max-w-2xl w-full mx-auto space-y-10 py-6">
            {/* FILE UPLOAD & DATE ROW (VERTICAL ON ALL) */}
            <div className="space-y-8 w-full">
                {/* SECTION 1: CORE DETAILS */}
                <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-8 w-full">
                    {/* FILE UPLOAD */}
                    <div className="space-y-4 text-center sm:text-left">
                        <div className="flex items-center gap-3 mb-2 px-1 text-black">
                            <div className="p-2 bg-black text-white rounded-xl">
                                <FileUp size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Source Syllabus</h3>
                        </div>

                        <label className="group relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[1.5rem] cursor-pointer bg-gray-50/50 hover:bg-white hover:border-black transition-all duration-300">
                            <div className="flex flex-col items-center justify-center p-6 text-center text-black">
                                {file ? (
                                    <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <FileUp size={32} />
                                        </div>
                                        <p className="text-md font-bold truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">File Selected Successfully</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-white shadow-sm border border-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:text-black transition-all duration-300">
                                            <FileUp size={32} />
                                        </div>
                                        <p className="text-md font-bold">Drop syllabus PDF here</p>
                                        <p className="text-sm text-gray-500 mt-1">or click to browse your files</p>
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

                    {/* DUE DATE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2 px-1 text-black">
                            <div className="p-2 bg-black text-white rounded-xl">
                                <Calendar size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Delivery Schedule</h3>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-black transition-all duration-300">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full bg-transparent p-4 pl-12 outline-none text-black font-medium appearance-none"
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: CONFIGURATION */}
                <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-6 w-full">
                    <div className="flex items-center justify-between px-1 text-black">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black text-white rounded-xl">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-lg font-bold">Structure</h3>
                        </div>
                        <button
                            onClick={addQuestionType}
                            className="text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
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
                <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-4 w-full">
                    <div className="flex items-center gap-3 mb-2 px-1 text-black">
                        <div className="p-2 bg-black text-white rounded-xl text-[10px] font-bold flex items-center justify-center">✨</div>
                        <h3 className="text-lg font-bold">Pro Tips & Preferences</h3>
                    </div>
                    <textarea
                        value={additionalInstructions}
                        onChange={(e) => setAdditionalInstructions(e.target.value)}
                        placeholder="✨ Example: Focus on Quantum Physics • Medium difficulty • Include diagrams if possible..."
                        className="w-full bg-gray-50/50 border border-gray-100 p-5 rounded-2xl h-40 focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all resize-none text-black font-medium text-lg placeholder:text-gray-300"
                    />
                    <p className="text-xs text-gray-400 font-medium px-2 italic">These instructions help our AI tailor the content to your specific needs.</p>
                </div>
            </div>
        </div>
    );

}

