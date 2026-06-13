import Assignment from "../model/assignment.model.js";
import { Request, Response } from "express";
import Result from "../model/result.model.js";
import { assignmentQueue } from "../queue/assignmentResult.queue.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../config/cloudinary.js";
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


        const uploadedSourcePdf = await uploadOnCloudinary(pdfBuffer, "source_pdfs", file.originalname);

        const pdfText = await extractTextFromPDF(pdfBuffer);

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
        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            });
        }


        if (assignment.status !== "completed") {
            return res.status(202).json({
                success: true,
                message: "Assignment is still being processed",
                data: { status: assignment.status, progress: assignment.progress }
            });
        }

        // find result by assignment id
        const result = await Result.findOne({
            assignmentId: assignment._id
        }).populate("assignmentId")

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found",
            });
        }

        // At this point, result.assignmentId is a fully populated Assignment document
        // We type-cast it to any or IAssignment to access its properties easily
        const assignmentData = result.assignmentId as any;

        return res.status(200).json({
            success: true,
            message: "Assignment fetched successfully",
            data: {
                id: result._id,
                assignmentId: assignmentData._id,
                subject: assignmentData.subject,
                grade: assignmentData.grade,
                testDuration: assignmentData.testDuration,
                dueDate: assignmentData.dueDate,
                status: assignmentData.status,
                sections: result.sections,
                generatedPdfUrl: result.generatedPdfUrl,
                generatedPdfPublicId: result.generatedPdfPublicId,
            }
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

// get all assignments 
const getAllAssignments = async (req: Request, res: Response) => {

    const assignments = await Assignment.find();
    if (!assignments) {
        return res.status(404).json({
            success: false,
            message: "No Assignment found",
        });
    }


    res.status(200).json({
        success: true,
        message: "All Assignments fetched successfully",
        data: {
            assignments
        }
    })
}

// delete assignment 
const deleteAssignment = async (req: Request, res: Response) => {
    try {
        const assignmentId = req.params.id;
        const assignment = await Assignment.findById(assignmentId);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: "Assignment not found",
            })
        }

        // find result if exists
        const result = await Result.findOne({
            assignmentId: assignment._id
        });

        // 1. Delete source pdf from cloudinary
        if (assignment.sourceFilePublicId) {
            await deleteFromCloudinary(assignment.sourceFilePublicId).catch(err =>
                console.error("Cloudinary source file delete error:", err)
            );
        }

        // 2. Handle Result cleanup if it exists
        if (result) {
            if (result.generatedPdfPublicId) {
                await deleteFromCloudinary(result.generatedPdfPublicId).catch(err =>
                    console.error("Cloudinary generated file delete error:", err)
                );
            }
            await result.deleteOne();
        }

        // 3. Delete assignment from database
        await assignment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        })

    } catch (error) {
        console.error("Delete assignment error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the assignment",
        });
    }
}



export { createAssignment, getAssignmentById, getAllAssignments, deleteAssignment }