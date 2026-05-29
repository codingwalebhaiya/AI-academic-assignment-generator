import Assignment from "../model/assignment.model.js";
import { Request, Response } from "express";
import { extractTextFromPDF } from "../utils/pdfParse.js";
import { assignmentPrompt } from "../utils/prompt.js";
import { assignmentGenerator } from "../utils/gemini.js";
import Result from "../model/result.model.js";

const createAssignment = async (req: Request, res: Response) => {
    try {
        const { dueDate, questionTypes, additionalInstructions } = req.body;

        if (!dueDate || !questionTypes ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const file = req.file;
        console.log(file)
        if (!file) {
            return res.status(400).json({ message: "File is required" });
        }

        const pdfBuffer = file.buffer;

        const pdfText = await extractTextFromPDF(pdfBuffer);
        console.log(pdfText);
        console.log(pdfText.length);

        const prompt = assignmentPrompt({
            pdfText: pdfText,
            questionTypes: JSON.parse(questionTypes),
            additionalInstructions
        });
        console.log(prompt)

        const generatedAssignment = await assignmentGenerator(prompt)
        console.log(generatedAssignment);

        // save to mongodb 
        const assignment = await Assignment.create({
            file: req.file?.originalname || "",
            dueDate,
            questionTypes: JSON.parse(questionTypes),
            additionalInstructions,
        });

        await Result.create({
            assignmentId: assignment._id,
            generatedContent: generatedAssignment
        })

        console.log(assignment);
        return res.status(201).json({ success: true, message: "Assignment created successfully", assignment, });

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
        console.log(assignment)
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
        console.log(result)

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
            generatedContent: result?.generatedContent || null
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