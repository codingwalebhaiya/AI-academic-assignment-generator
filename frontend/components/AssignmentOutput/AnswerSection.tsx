"use client";

import type { AnswerSection } from "./AssignmentPaper";

interface AnswerSectionProps {
    ansSection: AnswerSection;
}

export default function AnswerSection({ ansSection }: AnswerSectionProps) {
    return (
        <div className="space-y-8">
            <h1 className="text-center text-2xl font-bold">Section {ansSection.sectionName}</h1>
            <div className="space-y-8">
                {ansSection.answers.map((ans, ansIdx) => (
                    <div key={ansIdx} className="flex gap-4 items-start group">
                        <span className="font-bold text-xl text-black min-w-[32px]">{ans.questionNumber}.</span>
                        <p className="text-xl leading-relaxed text-gray-900 flex-1">
                            {ans.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
