import mongoose, { Schema } from "mongoose";
import { IAssignment } from "../types/assignment.types.js";

// this is parent schema
const assignmentSchema = new Schema<IAssignment>({
    // file will be stored in cloudinary and we will store the url of the file in the database 
    // file - url and fileType
    sourceFileUrl: {
        type: String,
        // required: true,
    },
    sourceFilePublicId: {
        type: String,
    },
    subject: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    testDuration: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    pdfText: {
        type: String,
        // required: true
    },

    questionTypes: [{
        questionType: {
            type: String,
            //   enum: ["mcq", "short", "long", "true_false", "fill_blank"],
            required: true
        },
        numberOfQuestions: {
            type: Number,
            required: true
        },
        marksPerQuestion: {
            type: Number,
            required: true
        }
    }],

    additionalInstructions: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['draft', 'processing', 'completed', 'failed'],
        default: 'draft'
    },
    progress: {
        type: Number,
        default: 0
    },
    jobId: {
        type: String,
        default: null,
        index: true
    }

},
    {
        timestamps: true
    }

)

const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;
