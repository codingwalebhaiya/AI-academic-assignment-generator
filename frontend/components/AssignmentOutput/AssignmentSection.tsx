"use client";

interface Question {
    questionNumber:number;
    text: string;
    difficulty: string;
    marks: number;
    options?: string[];
}

interface AssignmentSectionProps {
    section: {
        sectionName: string;
        title: string;
        instruction: string;
        questions: Question[];
    };
    sIdx: number;
}

export default function AssignmentSection({ section, sIdx }: AssignmentSectionProps) {
    return (
        <div className="space-y-8">

            <h1 className="text-center text-2xl font-bold " >Section {section.sectionName}</h1>

            <div className="text-start">
                
                <h3 className="text-xl font-black inline-block uppercase tracking-widest text-black mb-4">
                    {section.title || `Section ${String.fromCharCode(65 + sIdx)}`}
                </h3>
                <div className="space-y-1">
                    
                    <p className="text-sm text-gray-500 italic font-medium">{section.instruction || "Attempt all questions. Each question carries 2 marks"}</p>
                </div>
            </div>

            <div className="space-y-8">
                {section.questions.map((q, qIdx) => (
                    <div key={qIdx} className="flex gap-4 items-start group">
                        <span className="font-bold text-xl text-black min-w-[32px]">{q.questionNumber}.</span>
                        <p className="text-xl leading-relaxed text-gray-900 flex-1">
                            <span className="font-bold text-gray-500 mr-2">[{q.difficulty}]</span>
                            {q.text}
                            <span className="font-bold text-gray-500 ml-2">[{q.marks} Marks]</span>
                            {q.options?.map((option, optIdx) => (
                                
                                <span key={optIdx} className=" flex flex-col font-bold text-gray-500 ml-2 mt-2">{option}</span>
                            ))}
                            
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
