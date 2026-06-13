import { uploadOnCloudinary } from "../config/cloudinary.js";
import redisConfig from "../config/redis.config.js";
import Assignment from "../model/assignment.model.js";
import Result from "../model/result.model.js";
import { assignmentHTML } from "../utils/assignmentTemplate.js";
import { assignmentGenerator } from "../utils/gemini.js";
import { generateAssignmentPdf } from "../utils/generateAssignmentPdf.js";
import { assignmentPrompt } from "../utils/prompt.js";
import { Worker } from "bullmq"

export const assignmentWorker = new Worker("assignment-queue", async (job) => {

    const { assignmentId } = job.data;
    console.log("Step 1: assignmentId", assignmentId);

    const assignment = await Assignment.findById(assignmentId);
    console.log("Step 2: assignment found", assignment?._id);

    if (!assignment) {
        throw new Error("Assignment not found");
    }

    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 10,
            status: "processing",
        }
    );

    const prompt = assignmentPrompt({
        subject: assignment.subject,
        grade: assignment.grade,
        pdfText: assignment.pdfText,
        questionTypes: assignment.questionTypes,
        additionalInstructions: assignment.additionalInstructions ?? ""
    });

    console.log("Step 3: prompt created");


    const generatedAssignment = await assignmentGenerator(prompt);
    console.log("Step 4: AI generation complete");

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


    const maxMarks = assignment.questionTypes.reduce(
        (sum: number, q: any) => sum + q.numberOfQuestions * q.marksPerQuestion,
        0
    );

    console.log(maxMarks)

    const html = assignmentHTML({
        subject: assignment.subject,
        grade: assignment.grade,
        testDuration: assignment.testDuration,
        maxMarks,
        sections: generatedAssignment.sections,
    });
    console.log("HTML length:", html.length);
    console.log("Step 5: HTML generated", html.length);


    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 60,
        }
    );

    //from this code line - code is not work 
    const pdfBuffer = await generateAssignmentPdf(html);
    console.log("step 6: pdf buffer length:", pdfBuffer.length);
    // if (!pdfBuffer || pdfBuffer.length === 0) {
    //     throw new Error("Puppeteer returned an empty or invalid PDF buffer");
    // }


    await Assignment.findByIdAndUpdate(
        assignmentId,
        {
            progress: 80,
        }
    );



    const cloudinaryResponse = await uploadOnCloudinary(
        // Buffer.from(pdfBuffer),
        pdfBuffer,
        "generated_assignments",
        `assignment_${assignmentId}.pdf`
    )
    console.log("Step 7: Cloudinary upload complete");


    if (!cloudinaryResponse?.secure_url) {
        throw new Error("Cloudinary upload failed to return a secure URL");
    }

    console.log("cloudinary response", cloudinaryResponse)

    const result = await Result.create({
        assignmentId: assignment._id,
        sections: generatedAssignment.sections,
        generatedPdfUrl: cloudinaryResponse.secure_url,
        generatedPdfPublicId: cloudinaryResponse.public_id,
    })

    console.log("Step 8: Result saved");


    await Assignment.findByIdAndUpdate(assignmentId, {
        status: "completed",
        progress: 100
    })
    return result;
},

    {
        connection: redisConfig,
        concurrency: 2
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
    }
    console.error("Worker job failed:", err);
});

assignmentWorker.on("completed", (job) => {
    console.log(`✅ Job ${job?.id} completed`);
});

assignmentWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed:`, err);
});

assignmentWorker.on("error", (err) => {
    console.error("❌ Worker error:", err);
});