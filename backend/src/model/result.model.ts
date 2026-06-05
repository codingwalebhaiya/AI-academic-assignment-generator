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
        title: String,
        instruction: String,
        questions: [{
            text: String,
            difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard'] },
            marks: Number
        }]
    }],
    // generated assignment pdf url
    generatedPdfUrl: {
        type: String,
        required: false
    },
    generatedPdfPublicId: {
        type: String,
        required: false
    },

},
    {
        timestamps: true
    }
)

const Result = mongoose.model<IResult>("Result", result);

export default Result;