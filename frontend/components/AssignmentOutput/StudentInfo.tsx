"use client";

export default function StudentInfo() {
    return (
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
    );
}
