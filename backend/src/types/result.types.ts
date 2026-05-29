import { ObjectId } from "mongoose";

// Question Interface
export interface IQuestion {
  text: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  marks: number;
}

// Section Interface  
export interface ISection {
  title: string;        // "Section A", "Section B", etc.
  instruction: string;  // "Attempt all questions", etc.
  questions: IQuestion[];
}

// Meta Information Interface
export interface IMeta {
  subject: string;
  className: string;
  duration: string;     // "45 minutes", "2 hours", etc.
  totalMarks: number;
}

// Result Interface
export interface IResult {
  meta: IMeta;
  sections: ISection[];
  pdfUrl?: string;
  assignmentId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
