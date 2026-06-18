import { z } from "zod";

export const assignmentSchema = z.object({
    file: z.instanceof(File, { message: "File is required" }),
    subject: z.string().min(1, "Subject is required"),
    grade: z.string().min(1, "Grade is required"),
    testDuration: z.string().min(1, "Test duration is required"),
    dueDate: z.string().min(1, "Due date is required"),
    questionTypes: z.array(
        z.object({
            questionType: z.string().min(1, "Question type is required"),
            numberOfQuestions: z.number().min(1, "Number of questions is required"),
            marksPerQuestion: z.number().min(1, "Marks per question is required"),
        })
    ),
    additionalInstructions: z.string().min(1, "Additional instructions are required"),
});

export interface Assignment {
    _id: string;
    assignmentId: string;
    subject: string;
    grade: string;
    testDuration: number;
    dueDate: string;
    status: string;
    sections?: any[];
    generatedPdfUrl?: string;
    generatedPdfPublicId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type AssignmentFormValues = z.infer<typeof assignmentSchema>;
