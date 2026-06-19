"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StepIndicator from "@/features/assignments/components/AssignmentForm/StepIndicator";
import ConfigurationStep from "@/features/assignments/components/AssignmentForm/ConfigurationStep";
import PreviewStep from "@/features/assignments/components/AssignmentForm/PreviewStep";
import NavigationButtons from "@/features/assignments/components/AssignmentForm/NavigationButtons";
import { useAssignmentMutations } from "@/features/assignments/hooks/useAssignmentMutations";
import { useDispatch, useSelector } from "react-redux";
import AssignmentCreationProgress from "@/features/assignments/components/AssignmentCreationProgress";

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { createAssignment, isCreating } = useAssignmentMutations();
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("Math");
  const [grade, setGrade] = useState("10th");
  const [testDuration, setTestDuration] = useState("");
  const [dueDate, setDueDate] = useState("2026-06-04");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [questionTypes, setQuestionTypes] = useState([
    {
      questionType: "Multiple Choice Questions",
      numberOfQuestions: 4,
      marksPerQuestion: 1,
    },
    {
      questionType: "Short Questions",
      numberOfQuestions: 3,
      marksPerQuestion: 2,
    },
  ]);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { isFormOpen, formData } = useSelector((state: any) => state.assignments);

  const updateQuestionType = (index: number, field: string, value: any) => {
    const updated = [...questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionTypes(updated);
  };

  const handleIncrement = (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => {
    const updated = [...questionTypes];
    updated[index][field] += 1;
    setQuestionTypes(updated);
  };

  const handleDecrement = (index: number, field: 'numberOfQuestions' | 'marksPerQuestion') => {
    const updated = [...questionTypes];
    if (updated[index][field] > 1) {
      updated[index][field] -= 1;
      setQuestionTypes(updated);
    }
  };

  const addQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      {
        questionType: "New Question Type",
        numberOfQuestions: 1,
        marksPerQuestion: 1,
      },
    ]);
  };

  const removeQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const handleCreateAssignment = async () => {
    try {
      if (!file) {
        alert("Please upload file");
        return;
      }

      const payload = {
        file,
        subject,
        grade,
        testDuration,
        dueDate,
        questionTypes: JSON.stringify(questionTypes),
        additionalInstructions,
      };

      const response: any = await createAssignment(payload as any);
      if (response?.assignment?._id) {
        setCurrentAssignmentId(response.assignment._id);
      } else {
        throw new Error("Failed to get assignment ID: " + JSON.stringify(response));
      }
    } catch (error) {
      console.error("Assignment generation failed:", error);
      alert("Assignment generation failed");
    }
  };

  const handleNext = () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    if (!dueDate) {
      alert("Please select a due date.");
      return;
    }
    setStep(2);
  };

  const handlePrevious = () => {
    setStep(1);
  };

  return (
    <main className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-left w-full">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {currentAssignmentId ? "Generation Progress" : step === 1 ? "Create Assignment" : "Assignment Preview"}
            </h1>
            <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20">
              NEW
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {currentAssignmentId
              ? "Your assignment is being crafted by AI. Please stay on this page."
              : step === 1
                ? "Upload a PDF and configure your assignment parameters."
                : "Review your configuration before generating the assignment."}
          </p>
        </div>
      </div>

      {!currentAssignmentId && <StepIndicator step={step} />}

      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
        {currentAssignmentId ? (
          <AssignmentCreationProgress assignmentId={currentAssignmentId} />
        ) : step === 1 ? (
          <ConfigurationStep
            file={file}
            setFile={setFile}
            subject={subject}
            setSubject={setSubject}
            grade={grade}
            setGrade={setGrade}
            testDuration={testDuration}
            setTestDuration={setTestDuration}
            dueDate={dueDate}
            setDueDate={setDueDate}
            additionalInstructions={additionalInstructions}
            setAdditionalInstructions={setAdditionalInstructions}
            questionTypes={questionTypes}
            addQuestionType={addQuestionType}
            updateQuestionType={updateQuestionType}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            removeQuestionType={removeQuestionType}
          />
        ) : (
          <PreviewStep
            file={file}
            subject={subject}
            grade={grade}
            testDuration={testDuration}
            dueDate={dueDate}
            additionalInstructions={additionalInstructions}
            questionTypes={questionTypes}
          />
        )}

        {!currentAssignmentId && (
          <div className="mt-8 pt-8 border-t border-border">
            <NavigationButtons
              step={step}
              loading={isCreating}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              handleCreateAssignment={handleCreateAssignment}
            />
          </div>
        )}
      </div>
    </main>
  );
}