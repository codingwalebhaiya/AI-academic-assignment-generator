"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import StepIndicator from "@/components/AssignmentForm/StepIndicator";
import ConfigurationStep from "@/components/AssignmentForm/ConfigurationStep";
import PreviewStep from "@/components/AssignmentForm/PreviewStep";
import NavigationButtons from "@/components/AssignmentForm/NavigationButtons";

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");
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
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("dueDate", dueDate);
      formData.append("questionTypes", JSON.stringify(questionTypes));
      formData.append("additionalInstructions", additionalInstructions);

      const response = await axios.post(
        "http://localhost:8000/api/v1/assignments",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const assignmentId = response.data.assignment._id;
      router.push(`/assignments/${assignmentId}`);
    } catch (error) {
      console.log(error);
      alert("Assignment generation failed");
    } finally {
      setLoading(false);
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
          dueDate={dueDate}
          additionalInstructions={additionalInstructions}
          questionTypes={questionTypes}
        />
      )}

      <NavigationButtons
        step={step}
        loading={loading}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        handleCreateAssignment={handleCreateAssignment}
      />
    </div>
  );
}