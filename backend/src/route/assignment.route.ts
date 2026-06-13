import { Router } from "express";
import { createAssignment, getAssignmentById, getAllAssignments, deleteAssignment } from "../controller/assignment.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const assignmentRoutes = Router();

assignmentRoutes.post("/", upload.single("file"), createAssignment);
assignmentRoutes.get("/:id", getAssignmentById);
assignmentRoutes.get("/", getAllAssignments);
assignmentRoutes.delete("/:id", deleteAssignment);

export default assignmentRoutes;