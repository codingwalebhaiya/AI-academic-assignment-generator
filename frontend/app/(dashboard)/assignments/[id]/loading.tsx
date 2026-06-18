import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-background">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Preparing Preview</h2>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
            Fetching assignment data...
        </p>
      </div>
    </div>
  );
}
