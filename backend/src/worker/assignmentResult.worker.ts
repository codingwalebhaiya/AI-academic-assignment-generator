import { uploadOnCloudinary } from "../config/cloudinary.js";
import redisConfig from "../config/redis.config.js";
import Assignment from "../model/assignment.model.js";
import Result from "../model/result.model.js";
import { assignmentHTML } from "../utils/assignmentTemplate.js";
import { assignmentGenerator } from "../utils/gemini.js";
import { generateAssignmentPdf } from "../utils/generateAssignmentPdf.js";
import { assignmentPrompt } from "../utils/prompt.js";
import { extractTextFromPDF } from "../utils/pdfParse.js";
import { Worker } from "bullmq"
import fs from "fs"
import { SocketService } from "../config/socket.js";

export const assignmentWorker = new Worker("assignment-queue", async (job) => {

    const { assignmentId, localFilePath, originalName } = job.data;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
        // Cleanup if assignment not found
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        throw new Error("Assignment not found");
    }

    try {
        await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                progress: 5,
                status: "processing",
            }
        );
        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "processing",
            progress: 5,
            message: "Starting processing..."
        });

        // Process Source PDF 
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            throw new Error("Local file path not found or file does not exist");
        }

        const fileBuffer = fs.readFileSync(localFilePath);

        // Upload source to Cloudinary
        const uploadedSourcePdf = await uploadOnCloudinary(fileBuffer, "source_pdfs", originalName);

        // Extract text
        const pdfText = await extractTextFromPDF(fileBuffer);

        // Update assignment with source info
        await Assignment.findByIdAndUpdate(assignmentId, {
            sourceFileUrl: uploadedSourcePdf.secure_url,
            sourceFilePublicId: uploadedSourcePdf.public_id,
            pdfText,
            progress: 10
        });

        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "processing",
            progress: 10,
            message: "Source PDF processed and uploaded."
        });

        // Update local assignment object for prompt generation
        assignment.pdfText = pdfText;


        const prompt = assignmentPrompt({
            subject: assignment.subject,
            grade: assignment.grade,
            pdfText: assignment.pdfText,
            questionTypes: assignment.questionTypes,
            additionalInstructions: assignment.additionalInstructions ?? ""
        });

        const generatedAssignment = await assignmentGenerator(prompt);

        if (!generatedAssignment) {
            throw new Error(
                "AI failed to generate valid assignment after retries."
            );
        }

        await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                progress: 40,
            }
        );

        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "processing",
            progress: 40,
            message: "AI generation completed."
        });


        const maxMarks = assignment.questionTypes.reduce(
            (sum: number, q: any) => sum + q.numberOfQuestions * q.marksPerQuestion,
            0
        );

        const html = assignmentHTML({
            subject: assignment.subject,
            grade: assignment.grade,
            testDuration: assignment.testDuration,
            maxMarks,
            sections: generatedAssignment.sections,
        });


        await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                progress: 60,
            }
        );

        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "processing",
            progress: 60,
            message: "PDF generation started..."
        });

        const pdfBuffer = await generateAssignmentPdf(html);
        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error("Puppeteer returned an empty or invalid PDF buffer");
        }


        await Assignment.findByIdAndUpdate(
            assignmentId,
            {
                progress: 80,
            }
        );

        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "processing",
            progress: 80,
            message: "PDF generated successfully."
        });



        const cloudinaryResponse = await uploadOnCloudinary(
            pdfBuffer,
            "generated_assignments",
            `assignment_${assignmentId}.pdf`
        )


        if (!cloudinaryResponse?.secure_url) {
            throw new Error("Cloudinary upload failed to return a secure URL");
        }


        const result = await Result.create({
            assignmentId: assignment._id,
            sections: generatedAssignment.sections,
            generatedPdfUrl: cloudinaryResponse.secure_url,
            generatedPdfPublicId: cloudinaryResponse.public_id,
        })



        await Assignment.findByIdAndUpdate(assignmentId, {
            status: "completed",
            progress: 100
        })

        SocketService.emitToAssignment(assignmentId, "assignment-status", {
            status: "completed",
            progress: 100,
            message: "Assignment ready!",
            resultId: result._id
        });

        // Cleanup: Delete the local temp file
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
                console.log("Temp file deleted successfully");
            } catch (cleanupErr) {
                console.error("Cleanup error (temp file deletion):", cleanupErr);
            }
        }

        return result;
    } catch (error) {
        // Cleanup on failure
        if (localFilePath && fs.existsSync(localFilePath)) {
            try {
                fs.unlinkSync(localFilePath);
            } catch (e) { }
        }
        throw error;
    }
},
    {
        connection: redisConfig,
        concurrency: 1
    }
);


assignmentWorker.on("ready", () => {
    console.log("✅ Worker is ready");
});

assignmentWorker.on("failed", async (job, err) => {
    if (job?.data?.assignmentId) {
        await Assignment.findByIdAndUpdate(job.data.assignmentId, {
            status: "failed",
            progress: 0,
        });

        SocketService.emitToAssignment(job.data.assignmentId, "assignment-status", {
            status: "failed",
            progress: 0,
            message: err.message || "Job failed"
        });
    }
    console.error("Worker job failed:", err);
});

assignmentWorker.on("completed", (job) => {
    console.log(`✅ Job ${job?.id} completed`);
});
