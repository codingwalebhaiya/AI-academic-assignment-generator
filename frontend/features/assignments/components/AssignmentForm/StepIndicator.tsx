"use client";

interface StepIndicatorProps {
    step: number;
}

export default function StepIndicator({ step }: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center space-x-4 mb-8">
            <div className={`flex items-center space-x-2 ${step === 1 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 1 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>1</div>
                <span className="font-medium">Configure</span>
            </div>
            <div className="w-12 h-px bg-gray-200"></div>
            <div className={`flex items-center space-x-2 ${step === 2 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 2 ? 'border-black bg-black text-white' : 'border-gray-200'}`}>2</div>
                <span className="font-medium">Preview</span>
            </div>
        </div>
    );
}
