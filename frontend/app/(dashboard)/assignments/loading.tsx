import React from 'react';

export default function Loading() {
    return (
        <main className="space-y-8 pb-20">
            {/* Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-muted rounded-xl" />
                    <div className="h-4 w-64 bg-muted rounded-lg" />
                </div>
                <div className="h-12 w-36 bg-muted rounded-2xl" />
            </div>

            {/* Filter Bar Skeleton */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between animate-pulse">
                <div className="h-10 w-32 bg-muted rounded-xl" />
                <div className="h-12 w-full max-w-md bg-muted rounded-2xl" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="bg-card rounded-[2.5rem] border border-border p-8 h-[340px] flex flex-col gap-6 animate-pulse"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-2">
                                <div className="h-6 w-16 bg-muted rounded-lg" />
                                <div className="h-6 w-16 bg-muted rounded-lg" />
                            </div>
                            <div className="h-8 w-8 bg-muted rounded-full" />
                        </div>
                        <div className="space-y-3 flex-1">
                            <div className="h-6 w-3/4 bg-muted rounded-lg" />
                            <div className="h-4 w-full bg-muted rounded-lg" />
                            <div className="h-4 w-2/3 bg-muted rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-8 bg-muted rounded-xl" />
                            <div className="h-8 bg-muted rounded-xl" />
                        </div>
                        <div className="h-12 w-full bg-muted rounded-2xl" />
                    </div>
                ))}
            </div>
        </main>
    );
}
