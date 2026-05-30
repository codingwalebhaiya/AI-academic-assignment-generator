"use client";

interface AcademicHeaderProps {
    schoolName: string;
    subject: string;
    className: string;
    timeAllowed: string;
    maximumMarks: number;
}

export default function AcademicHeader({
    schoolName,
    subject,
    className,
    timeAllowed,
    maximumMarks,
}: AcademicHeaderProps) {
    return (
        <div className="text-center space-y-6">
            <h1 className="text-4xl font-black uppercase tracking-tight text-black leading-tight italic">
                {schoolName || "Your School Name"}
            </h1>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Subject: {subject}</h2>
                <h3 className="text-xl font-bold text-gray-700">Class: {className}</h3>
            </div>

            <div className="flex justify-between items-center pt-8 text-sm font-black uppercase tracking-widest text-black border-t-2 border-black/5">
                <div className="flex items-center gap-2">
                    Time Allowed: {timeAllowed || ""}
                </div>
                <div className="flex items-center gap-2">
                    Maximum Marks: {maximumMarks || ""}
                </div>
            </div>
            <p className="text-sm font-bold text-gray-600 mt-4 italic">All questions are compulsory unless stated otherwise.</p>
        </div>
    );
}
