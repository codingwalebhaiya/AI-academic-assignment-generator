import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv"
dotenv.config()

const getAI = new GoogleGenerativeAI(process.env.GOGGLE_GEMINI_API_KEY!);
const model = getAI.getGenerativeModel(
    {
        //model: "gemini-2.5-flash",
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json"
        }
    }
)

export default model;



