"use client";

import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface NavigationButtonsProps {
    step: number;
    loading: boolean;
    handlePrevious: () => void;
    handleNext: () => void;
    handleCreateAssignment: () => void;
}

export default function NavigationButtons({
    step,
    loading,
    handlePrevious,
    handleNext,
    handleCreateAssignment,
}: NavigationButtonsProps) {
    return (
        <div className="flex gap-4">
            {step === 2 && (
                <button
                    onClick={handlePrevious}
                    className="flex-1 border-2 border-primary text-primary py-4 rounded-2xl font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <ArrowLeft size={20} /> Previous
                </button>
            )}

            {step === 1 ? (
                <button
                    onClick={handleNext}
                    className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                >
                    Next <ArrowRight size={20} />
                </button>
            ) : (
                <button
                    onClick={handleCreateAssignment}
                    disabled={loading}
                    className="flex-[2] bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 group"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Generating Assignment...
                        </>
                    ) : (
                        <>
                            Create Assignment <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
