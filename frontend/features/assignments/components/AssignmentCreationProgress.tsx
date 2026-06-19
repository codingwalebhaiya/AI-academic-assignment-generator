"use client";

import { useEffect, useState } from "react";
import { getSocket, joinAssignmentRoom } from "@/lib/socket";
import { CheckCircle2, Loader2, Download, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AssignmentCreationProgressProps {
    assignmentId: string;
    onComplete?: (resultId: string) => void;
}

export default function AssignmentCreationProgress({
    assignmentId,
    onComplete,
}: AssignmentCreationProgressProps) {
    const [status, setStatus] = useState<"processing" | "completed" | "failed">("processing");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Initializing...");
    const [resultId, setResultId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch initial status
        const fetchInitialStatus = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/assignments/${assignmentId}`);
                if (response.ok) {
                    const result = await response.json();
                    const { data } = result;
                    if (data) {
                        setStatus(data.status);
                        setProgress(data.progress || 0);
                        if (data.status === 'completed' && data.id) {
                            setResultId(data.id);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch initial assignment status:", error);
            }
        };

        fetchInitialStatus();

        const socket = getSocket();
        joinAssignmentRoom(assignmentId);

        const handleStatusUpdate = (data: {
            status: "processing" | "completed" | "failed";
            progress: number;
            message: string;
            resultId?: string;
        }) => {
            setStatus(data.status);
            setProgress(data.progress);
            setMessage(data.message);
            if (data.resultId) {
                setResultId(data.resultId);
                if (onComplete) onComplete(data.resultId);
            }
        };

        socket.on("assignment-status", handleStatusUpdate);

        // Simulated progress incrementer
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (status === "processing" && prev < 98) {
                    // Slower increment as we approach 100% to avoid overshooting backend
                    // If backend sends 10, 50, 60, 85, we want to crawl towards those if we haven't reached them
                    const increment = prev < 10 ? 0.2 : prev < 50 ? 0.1 : prev < 85 ? 0.05 : 0.02;
                    return Math.min(prev + increment, 99);
                }
                return prev;
            });
        }, 1000);

        return () => {
            socket.off("assignment-status", handleStatusUpdate);
            clearInterval(interval);
        };
    }, [assignmentId, onComplete, status]);

    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-foreground tracking-tight">
                    {status === "completed" ? "Assignment Ready!" :
                        status === "failed" ? "Generation Failed" :
                            "Generating Your Assignment"}
                </h2>
                <p className="text-muted-foreground text-sm">
                    {message}
                </p>
            </div>

            <div className="w-full space-y-4">
                {/* Progress Bar Container */}
                <div className="relative h-4 w-full bg-secondary rounded-full overflow-hidden border border-border">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out flex items-center justify-end px-2"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="h-1 w-1 bg-white/40 rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>{status === "completed" ? "Done" : `${Math.floor(progress)}% Complete`}</span>
                    <span>{status === "completed" ? "100%" : `Processing Generation (${Math.floor(progress)}%)`}</span>
                </div>
            </div>

            {status === "processing" && (
                <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 px-6 py-3 rounded-2xl animate-pulse">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    <span className="text-sm font-bold text-primary">AI is magically crafting your assignment...</span>
                </div>
            )}

            {status === "completed" && (
                <div className="flex flex-col sm:flex-row gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Button asChild className="flex-1 rounded-[1.5rem] h-14 font-black text-sm uppercase tracking-tighter" variant="default">
                        <Link href={`/assignments/${assignmentId}`}>
                            <Download className="mr-2 h-5 w-5" />
                            View & Download PDF
                        </Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-[1.5rem] h-14 font-black text-sm uppercase tracking-tighter" variant="outline">
                        <Link href="/assignments">
                            Go to Assignments
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            )}

            {status === "failed" && (
                <div className="text-center space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-destructive/10 text-destructive border-2 border-destructive/20">
                        <AlertCircle className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-destructive font-black uppercase text-xs tracking-widest">Error Occurred</p>
                        <p className="text-muted-foreground text-sm font-medium">{message}</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="destructive" className="rounded-2xl px-10 h-12 font-black uppercase tracking-tight">
                        Try Again
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-6 w-full pt-8 border-t border-border/50">
                <StatusItem
                    label="Analyze PDF"
                    active={progress >= 5 && progress < 10}
                    completed={progress >= 10 || status === 'completed'}
                />
                <StatusItem
                    label="AI Magic"
                    active={progress >= 10 && progress < 50}
                    completed={progress >= 50 || status === 'completed'}
                />
                <StatusItem
                    label="PDF Export"
                    active={progress >= 50 && progress < 100}
                    completed={progress >= 100 || status === 'completed'}
                />
            </div>
        </div>
    );
}

function StatusItem({ label, active, completed }: { label: string, active: boolean, completed: boolean }) {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center border-2 transition-all duration-700 ${completed ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' :
                active ? 'border-primary text-primary bg-primary/5 animate-pulse' :
                    'border-muted text-muted-foreground bg-muted/5'
                }`}>
                {completed ? <CheckCircle2 className="h-6 w-6" /> : <Loader2 className={`h-6 w-6 ${active ? 'animate-spin' : ''}`} />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest text-center ${active || completed ? 'text-foreground' : 'text-muted-foreground'
                }`}>{label}</span>
        </div>
    )
}
