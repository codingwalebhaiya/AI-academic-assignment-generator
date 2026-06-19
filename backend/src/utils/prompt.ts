

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
1. Generate questions only from the provided SYLLABUS CONTENT.
2. Follow QUESTION CONFIGURATION exactly (sections, question count, and marks).
3. Use only these difficulty values: Easy, Moderate, Hard.
4. Return valid JSON only. No markdown or extra text.
5. Use the provided Subject and Grade when needed.
6. Use only these question types:
 * mcq
 * short
 * long
 * true_false
 * fill_blank
7. Never use: short_answer, long_answer, truefalse, fillintheblank, essay, descriptive, or any other type.
8. For MCQ:

   * Include exactly 4 options.
   * Options format: { "label": "a|b|c|d", "text": "Option" }.
   * Labels must be a, b, c, d in order.
9. For non-MCQ questions, return "options": [].
10. Ensure all fields match the specified JSON schema exactly.


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
    {
      "label": "a",
      "text": "Rectifier"
    },
    {
      "label": "b",
      "text": "Transformer"
    },
    {
      "label": "c",
      "text": "Inductor"
    },
    {
      "label": "d",
      "text": "Capacitor"
    }
  ]
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


