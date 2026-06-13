import { Schema } from "mongoose";
import { IResult } from "../types/result.types.js";
import mongoose from "mongoose";

// this is child schema of assignment model 
const result = new Schema<IResult>({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",   // child reference to parent model
        required: true
    },
    sections: [{
        sectionName: String,
        title: String,
        instruction: String,
        questions: [{
            text: String,
            type: {
                type: String,
                enum: ["mcq", "short", "long", "true_false", "fill_blank"],
                required: true
            },
            options: {
                type: [String],
                default: []
            },
            difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] },
            marks: Number
        }]
    }],
    // generated assignment pdf url
    generatedPdfUrl: {
        type: String,
        required: true
    },
    generatedPdfPublicId: {
        type: String,
        required: true
    },

},
    {
        timestamps: true
    }
)

const Result = mongoose.model<IResult>("Result", result);

export default Result;