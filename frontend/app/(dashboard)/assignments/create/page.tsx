"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import StepIndicator from "@/features/assignments/components/AssignmentForm/StepIndicator";
import ConfigurationStep from "@/features/assignments/components/AssignmentForm/ConfigurationStep";
import PreviewStep from "@/features/assignments/components/AssignmentForm/PreviewStep";
import NavigationButtons from "@/features/assignments/components/AssignmentForm/NavigationButtons";
import { useAssignmentMutations } from "@/features/assignments/hooks/useAssignmentMutations";
import { useDispatch, useSelector } from "react-redux";

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

  const dispatch = useDispatch();
  const { isFormOpen, formData } = useSelector((state: any) => state.assignments);

  const { createAssignment: createMut, isCreating: creating } = useAssignmentMutations();

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

      await createAssignment(payload as any);
      router.push("/assignments");
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
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white min-h-screen">
      <StepIndicator step={step} />

      <div className="space-y-2 text-center text-black">
        <h1 className="text-3xl font-bold tracking-tight">
          {step === 1 ? "Create Assignment" : "Assignment Preview"}
        </h1>
        <p className="text-gray-500">
          {step === 1
            ? "Upload a PDF and configure your assignment parameters."
            : "Review your configuration before generating the assignment."}
        </p>
      </div>

      {step === 1 ? (
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

      <NavigationButtons
        step={step}
        loading={isCreating}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleCreateAssignment={handleCreateAssignment}
      />
    </div>
  );
}