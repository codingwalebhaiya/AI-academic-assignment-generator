import { z } from "zod"

export const questionTypeSchema = z.object({
    questionType: z.string().min(1, "Question type is required"),
    numberOfQuestions: z.number().min(1, "Number of questions is required"),
    marksPerQuestion: z.number().min(1, "Marks per question is required")
})

export const assignmentSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    grade: z.string().min(1, "Grade is required"),
    testDuration: z.string().min(1, "Test duration is required"),
    dueDate: z.string().min(1, "Due date is required"),
    questionTypes: z.array(questionTypeSchema).min(1),
    additionalInstructions: z.string().optional()
})

// This creates a TypeScript type from the schema.
export type AssignmentInput = z.infer<typeof assignmentSchema>;

//Equivalent to:

// type AssignmentInput = {
//   subject: string;
//   grade: string;
//   testDuration: string;
//   dueDate: string;
//   questionTypes: {
//     questionType: string;
//     numberOfQuestions: number;
//     marksPerQuestion: number;
//   }[];
//   additionalInstructions?: string;
// };

//You can use it in services:

// import { AssignmentInput } from "../validation/assignment.schema";
// const createAssignmentService = async (
//   data: AssignmentInput
// ) => {
//   // fully typed
// };

