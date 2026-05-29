import { Router } from "express";
import { createAssignment, getAssignmentById } from "../controller/assignment.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const assignmentRoutes = Router();

assignmentRoutes.post("/", upload.single("file"), createAssignment);
assignmentRoutes.get("/:id", getAssignmentById);
// router.get("/", getAllAssignments);

export default assignmentRoutes;