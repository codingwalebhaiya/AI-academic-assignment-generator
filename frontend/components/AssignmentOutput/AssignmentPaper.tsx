"use client";

import AcademicHeader from "./AcademicHeader";
import StudentInfo from "./StudentInfo";
import AssignmentSection from "./AssignmentSection";
import AnswerSection from "./AnswerSection";

export interface Answer {
    questionNumber: number;
    answer: string
}

export interface AnswerSection {
    sectionName: string;
    answers: Answer[];
}

interface Question {
    questionNumber: number;
    text: string;
    difficulty: string;
    marks: number;
    options?: string[];
}

interface Section {
    sectionName: string;
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
    answerKey: AnswerSection[];
}

interface AssignmentPaperProps {
    data: AssignmentData;
}

export default function AssignmentPaper({ data }: AssignmentPaperProps) {
    return (
        <div className="max-w-5xl mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] overflow-hidden print:shadow-none print:rounded-none">
            <div className="p-12 sm:p-20 space-y-12">
                <AcademicHeader
                    schoolName={data.schoolName}
                    subject={data.subject}
                    className={data.className}
                    timeAllowed={data.timeAllowed}
                    maximumMarks={data.maximumMarks}
                />

                <StudentInfo />

                <div className="space-y-16">
                    {data.sections.map((section, sIdx) => (
                        <AssignmentSection key={sIdx} section={section} sIdx={sIdx} />
                    ))}
                </div>

                <div className="pt-10 text-center">
                    <p className="font-black text-black uppercase tracking-[0.5em] text-sm opacity-20">— End of Question Paper —</p>
                </div>

                <div className="pt-10 text-start">
                    <p className="font-bold text-black uppercase text-xl ">Answer Key</p>
                </div>





                <div className="space-y-16">
                    {data.answerKey.map((ansSection, ansSectionIdx) => (
                        <AnswerSection key={ansSectionIdx} ansSection={ansSection} />
                    ))}
                </div>



            </div>
        </div>
    );
}
