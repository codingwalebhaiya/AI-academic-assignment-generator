import dotenv from "dotenv"
dotenv.config();
import { connectDB } from "../config/db.js";

// first - connect to mongodb 
connectDB()

// then start the worker server
import "../worker/assignmentResult.worker.js";

console.log("✅ Assignment worker started");