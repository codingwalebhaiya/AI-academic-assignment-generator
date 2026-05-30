

export const assignmentPrompt = ({
  pdfText,
  questionTypes,
  additionalInstructions,
}: {
  pdfText: string;
  questionTypes: any[];
  additionalInstructions?: string;
}) => {
  return `
You are an expert academic assignment paper generator.

Your task is to generate a structured assignment paper STRICTLY based on the provided syllabus content.

IMPORTANT RULES:

1. Generate questions ONLY from the syllabus.
2. Do NOT add topics outside the syllabus.
3. Return ONLY valid JSON.
4. Do NOT include markdown, explanation, notes, or extra text.
5. If any information like className or timeAllowed is NOT clearly provided in instructions, return empty string "".
6. Do NOT generate schoolName.
7. Keep question language clear, student-friendly, and academically correct.
8. Difficulty values must only be:
   - "Easy"
   - "Medium"
   - "Hard"
9. Marks must match question difficulty logically.
10. Generate answerKey for every question.

SYLLABUS:
${pdfText}

QUESTION CONFIGURATION:
${JSON.stringify(questionTypes)}

USER INSTRUCTIONS:
${additionalInstructions || "No additional instructions provided."}

JSON FORMAT:

{
  "subject": "",
  "className": "",
  "timeAllowed": "",
  "maximumMarks": 0,
  "sections": [
    { "sectionName": "A,B,C,D..... ",
      "title": "",
      "instruction": "",
      "questions": [
        {
          "questionNumber": 1,
          "text": "",
          "difficulty": "Easy",
          "marks": 2
        }
      ]
    }
  ],
  "answerKey": [
    { "sectionName": "A,B,C,D..... ",
    "answers": [
    {
     "questionNumber": 1,
      "answer": ""
    }
    ]
    }
  ]
}

VALIDATION RULES:

- className:
  -> Fill ONLY if explicitly mentioned in USER INSTRUCTIONS.
  -> Otherwise return "".

- timeAllowed:
  -> Fill ONLY if explicitly mentioned in USER INSTRUCTIONS.
  -> Otherwise return "".

- maximumMarks:
  -> Calculate from total question marks.

- sections:
  -> Create sections according to QUESTION CONFIGURATION.

- answerKey:
  -> Must contain answers for ALL questions.

Return ONLY valid parsable JSON.
`;
};

