
import mongoose, { Schema, Types } from "mongoose";

export interface IResult {
    assignmentId: Types.ObjectId;
    generatedContent: Object;
}
const result = new Schema<IResult>({
    assignmentId: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    generatedContent: {
        type: Object,
        required: true
    },

},
    {
        timestamps: true
    }
)

const Result = mongoose.model<IResult>("Result", result);

export default Result;