import Assignment from "../model/assignment.model.js";
import { Request, Response } from "express";
import Result from "../model/result.model.js";
import { assignmentQueue } from "../queue/assignmentResult.queue.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { extractTextFromPDF } from "../utils/pdfParse.js";

const createAssignment = async (req: Request, res: Response) => {
    try {
        const { subject, grade, testDuration, dueDate, questionTypes, additionalInstructions } = req.body;

        if (!subject || !grade || !testDuration || !dueDate || !questionTypes) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }

        const pdfBuffer = file.buffer;


        // upload source pdf file to cloudinary 
        const uploadedSourcePdf = await uploadOnCloudinary(pdfBuffer, "source_pdfs", file.originalname);

        const pdfText = await extractTextFromPDF(pdfBuffer);

        // create a assignment  
        const assignment = await Assignment.create({
            sourceFileUrl: uploadedSourcePdf.secure_url,
            sourceFilePublicId: uploadedSourcePdf.public_id,
            subject,
            grade,
            testDuration,
            dueDate,
            pdfText,
            questionTypes: JSON.parse(questionTypes),
            additionalInstructions,
            status: 'processing'

        })

        //Add to BullMQ, passing the MongoDB ID as the payload reference
        const job = await assignmentQueue.add('generate-assignment',
            {
                assignmentId: assignment._id.toString(),
            },
            {
                jobId: assignment._id.toString()
            }
        );

        // update jobId 
        await Assignment.findByIdAndUpdate(assignment._id,
            {
                jobId: job.id
            }
        )

        return res.status(202).json({ success: true, message: "Assignment generation started", assignment, });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Assignment generation failed",
        });
    }
}

const getAssignmentById = async (req: Request, res: Response) => {

    try {
        const assignment = await Assignment.findById(req.params.id)
        // console.log(assignment)
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }

        // find result by assignment id
        const result = await Result.findOne({
            assignmentId: assignment._id
        })

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Assignment fetched successfully",
            assignment,
            generatedContent: result?.sections || null,
            generatedPdfUrl: result?.generatedPdfUrl || null,
            generatedPdfPublicId: result?.generatedPdfPublicId || null,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Assignment fetching failed",
        })
    }
}



export { createAssignment, getAssignmentById }