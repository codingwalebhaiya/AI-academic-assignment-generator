"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Minus, FileUp, Calendar, Trash2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

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
      console.log(response)

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
      {/* STEP INDICATOR */}
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
        <div className="grid gap-8 md:grid-cols-2">
          {/* STEP 1: CONFIGURATION */}
          <div className="space-y-6">
            {/* FILE UPLOAD */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-black">
                <FileUp size={18} /> Upload PDF
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <p className="text-sm text-green-600 font-medium">{file.name}</p>
                    ) : (
                      <>
                        <FileUp className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setFile(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* DUE DATE */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2 text-black">
                <Calendar size={18} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-black outline-none transition-all text-black"
              />
            </div>

            {/* ADDITIONAL INSTRUCTIONS */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-black">Additional Instructions(For better output)</label>
              <textarea
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                placeholder="✨ Example: Class 10 Science • Subject: Physics • Duration: 1 Hour"
                className="w-full border p-3 rounded-lg h-32 focus:ring-2 focus:ring-black outline-none transition-all resize-none text-black"
              />
            </div>
          </div>

          <div className="space-y-6">
            {/* QUESTION TYPES */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-black">Question Configuration</label>
              <button
                onClick={addQuestionType}
                className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Type
              </button>
            </div>

            <div className="space-y-4">
              {questionTypes.map((qt, index) => (
                <div key={index} className="p-4 border rounded-xl bg-gray-50 space-y-4 relative group">
                  {questionTypes.length > 1 && (
                    <button
                      onClick={() => removeQuestionType(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <input
                    type="text"
                    value={qt.questionType}
                    onChange={(e) => updateQuestionType(index, "questionType", e.target.value)}
                    className="bg-transparent font-semibold w-full focus:outline-none placeholder-gray-400 text-black"
                    placeholder="Question Type Name"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Questions</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDecrement(index, 'numberOfQuestions')}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-black"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium text-black">{qt.numberOfQuestions}</span>
                        <button
                          onClick={() => handleIncrement(index, 'numberOfQuestions')}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-black"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Marks</p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDecrement(index, 'marksPerQuestion')}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-black"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center font-medium text-black">{qt.marksPerQuestion}</span>
                        <button
                          onClick={() => handleIncrement(index, 'marksPerQuestion')}
                          className="p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors text-black"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STEP 2: PREVIEW */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6 border rounded-2xl p-6 bg-gray-50/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} /> General Details
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Selected File</span>
                  <span className="font-medium text-black truncate max-w-[200px]">{file?.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-500">Due Date</span>
                  <span className="font-medium text-black">{dueDate}</span>
                </div>
                <div className="space-y-2 py-2">
                  <span className="text-gray-500">Additional Instructions</span>
                  <p className="text-sm p-3 bg-white border rounded-lg text-black min-h-[80px]">
                    {additionalInstructions || "No instructions provided."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 border rounded-2xl p-6 bg-gray-50/50">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} /> Question Config
              </h3>
              <div className="space-y-3">
                {questionTypes.map((qt, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-sm">
                    <div>
                      <p className="font-bold text-black">{qt.questionType}</p>
                      <p className="text-xs text-gray-500">
                        {qt.numberOfQuestions} questions • {qt.marksPerQuestion} marks each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-black">Total</p>
                      <p className="text-lg font-black">{qt.numberOfQuestions * qt.marksPerQuestion}</p>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <span className="font-bold text-gray-500">Total Questions</span>
                  <span className="text-2xl font-black text-black">
                    {questionTypes.reduce((acc, curr) => acc + curr.numberOfQuestions, 0)}
                  </span>
                  <span className="font-bold text-gray-500">Total Marks</span>
                  <span className="text-2xl font-black text-black">
                    {questionTypes.reduce((acc, curr) => acc + (curr.numberOfQuestions * curr.marksPerQuestion), 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATION BUTTONS */}
      <div className="pt-6 border-t border-gray-100 flex gap-4">
        {step === 2 && (
          <button
            onClick={handlePrevious}
            className="flex-1 border-2 border-black text-black py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={20} /> Previous
          </button>
        )}

        {step === 1 ? (
          <button
            onClick={handleNext}
            className="flex-1 bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Next <ArrowRight size={20} />
          </button>
        ) : (
          <button
            onClick={handleCreateAssignment}
            disabled={loading}
            className="flex-[2] bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
    </div>
  );
}