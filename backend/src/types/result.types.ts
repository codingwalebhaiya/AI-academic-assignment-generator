
import mongoose from "mongoose";

//One Small Tip for "Populated" Fields
//If you plan to use .populate("assignmentId") 
//later in your services/controllers,
// the type of assignmentId will change from an ID to the actual Assignment Document. 
// In those cases, you might eventually see patterns like:
// If you ever need to support both the ID and the Populated Object
// assignmentId: mongoose.Types.ObjectId | IAssignment; 

export interface IResult {
  assignmentId: mongoose.Types.ObjectId;
  sections: {
    title: string;
    instruction: string;
    questions: {
      text: string;
      difficulty: string;
      marks: number;
    }[];
  }[];
  generatedPdfUrl: string;
  generatedPdfPublicId: string;
}
