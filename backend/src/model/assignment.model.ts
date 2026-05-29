import mongoose, { Schema } from "mongoose";

export interface IQuestionType {
    questionType: string;
    numberOfQuestions: number;
    marksPerQuestion: number;
}

export interface IAssignment {
    file: string;
    dueDate: Date;
    questionTypes: IQuestionType[];
    additionalInstructions?: string;
}


const assignmentSchema = new Schema<IAssignment>({

    file: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },

    questionTypes: [{
        questionType: {
            type: String,
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
    }

},
    {
        timestamps: true
    }

)

const Assignment = mongoose.model<IAssignment>('Assignment', assignmentSchema);

export default Assignment;
