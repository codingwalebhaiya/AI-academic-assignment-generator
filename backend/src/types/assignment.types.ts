
export interface IQuestionType {
  questionType: string;
  numberOfQuestions: number;
  marksPerQuestion: number;
}

export interface IAssignment {
  sourceFileUrl: string;
  sourceFilePublicId: string;
  subject: string;
  grade: string;
  testDuration: string;
  dueDate: Date;
  pdfText: string;
  questionTypes: IQuestionType[];
  additionalInstructions?: string | null;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  progress: number;
  jobId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
 