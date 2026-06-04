// express app setup
import express from "express"
import cors from "cors"
//import dotenv from "dotenv"
import errorMiddleware from "./middleware/error.middleware.js";
import assignmentRoutes from "./route/assignment.route.js";
//dotenv.config();
// import worker file path 
import "../src/worker/assignmentResult.worker.js"

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1/assignments',assignmentRoutes)

app.get("/", (req, res) => {
    res.send("Hello World from backend!");
});

 
app.use(errorMiddleware)

export default app;  
