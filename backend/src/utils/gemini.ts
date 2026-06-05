import model from "../config/llm.js";

export const assignmentGenerator = async (prompt: string) => {
    try {
        const result = await model.generateContent(prompt)
        const text = result.response.text();

        const cleanedText = text.replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanedText)

    } catch (error) {
        console.log("Error generating assignment:", error);
        throw error;
    }
}  