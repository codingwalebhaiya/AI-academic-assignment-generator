"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-300">
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-red-100 rounded-3xl rotate-6 animate-pulse" />
                    <div className="absolute inset-0 bg-red-50 rounded-3xl -rotate-3" />
                    <div className="relative flex items-center justify-center w-full h-full text-red-600">
                        <AlertCircle size={48} strokeWidth={2.5} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Something went wrong</h1>
                    <p className="text-muted-foreground font-medium px-4">
                        {error.message || "An unexpected error occurred while processing assignments."}
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => reset()}
                        className="h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <RefreshCcw className="mr-2" size={20} />
                        Try again
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            asChild
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-border text-foreground hover:bg-muted font-bold transition-all"
                        >
                            <Link href="/assignments">
                                <ArrowLeft className="mr-2" size={18} />
                                Back
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="flex-1 h-12 rounded-xl border-border text-foreground hover:bg-muted font-bold transition-all"
                        >
                            <Link href="/">
                                <Home className="mr-2" size={18} />
                                Dashboard
                            </Link>
                        </Button>
                    </div>
                </div>

                {error.digest && (
                    <p className="text-[10px] text-muted-foreground/50 font-mono tracking-widest uppercase">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
