import { ObjectId } from "mongoose";

// Question Configuration Interface
export interface IQuestionConfig {
  type: string;        // "MCQ", "Short Answer", "Long Answer", etc.
  count: number;       // Number of questions of this type
  marks: number;       // Marks per question
}

// Source File Interface
export interface ISourceFile {
  fileName: string;
  fileUrl: string;
  mimeType: string;
}

// Assignment Interface
export interface IAssignment {
  title: string;
  subject: string;
  class: string;
  dueDate: Date;
  // questionConfig: IQuestionConfig[];
  sections: [
    questionTypes: string   ,
    numberOfQuestions: number,
    marksPerQuestion: number,
    difficulty: string
  ];
  totalQuestions: number;
  totalMarks: number;
  additionalInstructions?: string | null;
  sourceFile?: ISourceFile;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  progress: number;
  jobId?: string;
  resultId?: ObjectId | IResult;
  createdAt: Date;
  updatedAt: Date;
}

// Import Result type (circular reference solution)
import { IResult } from "./result.types.js";