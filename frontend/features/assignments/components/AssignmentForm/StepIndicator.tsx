"use client";

interface StepIndicatorProps {
    step: number;
}

export default function StepIndicator({ step }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${step === 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>1</div>
                <span className="font-medium">Configure</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div className={`flex items-center space-x-2 ${step === 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>2</div>
                <span className="font-medium">Preview</span>
            </div>
        </div>
    );
}
