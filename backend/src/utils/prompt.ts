

export const assignmentPrompt = ({
  subject,
  grade,
  pdfText,
  questionTypes,
  additionalInstructions,
}: {
  subject: string;
  grade: string;
  pdfText: string;
  questionTypes: any[];
  additionalInstructions?: string;
}) => {
  return `
You are an expert academic assignment paper generator.

Your task is to generate a structured assignment paper STRICTLY based on the provided syllabus content.

ACADEMIC CONTEXT:
- Subject: ${subject}
- Class/Grade: ${grade}
- Additional User Instructions: ${additionalInstructions || "None"}

SYLLABUS CONTENT:
${pdfText}

QUESTION CONFIGURATION (STRICT):
${JSON.stringify(questionTypes, null, 2)}

IMPORTANT RULES:
1. Generate questions ONLY from the SYLLABUS CONTENT mentioned above.
2. Follow the QUESTION CONFIGURATION strictly. For each item in the configuration, create a corresponding section.
3. Total number of questions and marks for each section must match the configuration exactly.
4. Difficulty values MUST only be: "Easy", "Moderate", or "Hard".
5. Return ONLY valid JSON. No markdown wrappers or extra text.
6. If subject or className is not explicitly clear from the configuration, use the provided Academic Context values.
7. marks per question must match the configuration.

JSON FORMAT TO RETURN:
{
  "sections": [
    {
      "sectionName": "e.g., Section A, ...",
      "title": "e.g., Multiple Choice Questions",
      "instruction": "e.g., Answer all questions by choosing the correct option.",
      "questions": [
        {
          "type": "mcq",
          "text": "The question content here",
          "options": [
            "Rectifier",
            "Transformer",
            "Inductor",
            "Capacitor"
         ],
          "difficulty": "Moderate",
          "marks": 2
        }
      ]
    }
  ]
}

VALIDATION:
- Ensure the output strictly follows the structure above for integration with the database.
`;
};


