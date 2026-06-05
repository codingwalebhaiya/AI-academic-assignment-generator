import redisConfig from "../config/redis.config.js";
import Assignment from "../model/assignment.model.js";
import Result from "../model/result.model.js";
import { assignmentGenerator } from "../utils/gemini.js";
import { assignmentPrompt } from "../utils/prompt.js";
import { Worker } from "bullmq"


export const assignmentWorker = new Worker("assignment-queue", async (job) => {
    const { assignmentId } = job.data;
    //console.log("assignmentid in worker", assignmentId)

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
        throw new Error("Assignment not found");
    }

    await job.updateProgress(30);
    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 30
        }
    )

    const prompt = assignmentPrompt({
        subject: assignment.subject,
        grade: assignment.grade,
        testDuration: assignment.testDuration,
        dueDate: assignment.dueDate,
        pdfText: assignment.pdfText,
        questionTypes: assignment.questionTypes,
        additionalInstructions: assignment.additionalInstructions as string
    });

    console.log("prompt text length", prompt.length)

    await job.updateProgress(50);
    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 50
        }
    )
    const generatedAssignment = await assignmentGenerator(prompt);
    console.log("pdf text length ", generatedAssignment.sections.length.toString())

    await job.updateProgress(80);
    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 80
        }
    )
    const result = await Result.create({
        assignmentId: assignment._id,
        sections: generatedAssignment.sections,
        // generatedPdfUrl: generatedAssignment.generatedPdfUrl,
        // generatedPdfPublicId: generatedAssignment.generatedPdfPublicId,

    });
    // console.log("result in worker ", result)

    assignment.status = "completed";
    await assignment.save();
    await job.updateProgress(100);
    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 100
        }
    )
    return result;
},

    {
        connection: redisConfig,
        concurrency: 1
    }

);

// assignmentWorker.on("completed", (job, result) => {
//     console.log(`Job ${job.id} completed:`, result);
// })

// assignmentWorker.on("failed", (job, error) => {
//     console.log(`Job ${job.id} failed:`, error);
// })

// assignmentWorker.on("error", (error) => {
//     console.log(`Job ${job.id} progress: ${progress}%`);
// })