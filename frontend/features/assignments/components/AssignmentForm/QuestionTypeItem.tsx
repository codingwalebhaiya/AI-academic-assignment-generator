"use client";

import { Plus, Minus, Trash2 } from "lucide-react";

interface QuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

interface QuestionTypeItemProps {
    qt: QuestionType;
    index: number;
    totalItems: number;
    onUpdate: (index: number, field: string, value: any) => void;
    onIncrement: (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => void;
    onDecrement: (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => void;
    onRemove: (index: number) => void;
}

export default function QuestionTypeItem({
    qt,
    index,
    totalItems,
    onUpdate,
    onIncrement,
    onDecrement,
    onRemove,
}: QuestionTypeItemProps) {
    return (
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-5 relative group hover:shadow-md transition-all duration-300">
            {totalItems > 1 && (
                <button
                    onClick={() => onRemove(index)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 hover:scale-110 transition-all"
                >
                    <Trash2 size={18} />
                </button>
            )}

            <div className="space-y-1.5 px-1 text-black">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Type Name</p>
                <input
                    type="text"
                    value={qt.questionType}
                    onChange={(e) => onUpdate(index, "questionType", e.target.value)}
                    className="bg-transparent font-bold w-full focus:outline-none placeholder-gray-300 text-xl"
                    placeholder="e.g. MCQ, Short Answer..."
                />
            </div>

            <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                <div className="space-y-2 text-center sm:text-left text-black">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Quantity</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <button
                            onClick={() => onDecrement(index, 'numberOfQuestions')}
                            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{qt.numberOfQuestions}</span>
                        <button
                            onClick={() => onIncrement(index, 'numberOfQuestions')}
                            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2 text-center sm:text-left text-black">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">Weightage</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <button
                            onClick={() => onDecrement(index, 'marksPerQuestion')}
                            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{qt.marksPerQuestion}</span>
                        <button
                            onClick={() => onIncrement(index, 'marksPerQuestion')}
                            className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm hover:bg-black hover:text-white transition-all active:scale-90"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
