import { Worker } from "bullmq";
import { assignmentQueue } from "./queue";
import Result from "../model/result.model.js";

const worker = new Worker('generate-assignment', async (job) => {
    const { assignmentId, title, subject, class, dueDate, questionConfig, totalQuestions, totalMarks, additionalInstructions, sourceFile } = job.data;

    // update progress to 10% 
    await updateProgress(assignmentId, 10);
    emitWebSocket(assignmentId, 'progress', 10);

    // process uploaded files (if any)
    let extractedText = '';
    if (job.data.sourceFile && job.data.sourceFile.length > 0) {
        extractedText = await processUploadedFiles(job.data.sourceFile);
        await updateProgress(assignmentId, 30);
        emitWebSocket(assignmentId, 'progress', 30);

    }

    // build structured prompt for ai 
    const prompt = ` 
            Generate a question paper based on the following details:
            Title: ${title}
            Subject: ${subject}
            Class: ${class}
            Question Config: ${questionConfig.map((item: any) => `Type: ${item.type}, Count: ${item.count}, Marks: ${item.marks}`).join(", ")}
            Total Questions: ${totalQuestions}
            Total Marks: ${totalMarks}
            Reference Source File (if provided): ${extractedText}
            Additional Instructions: ${additionalInstructions}

             Return in JSON format:                                       │
│     {                                                            │
│       "sections": [                                              │
│         {                                                        │
│           "name": "Section A",                                   │
│           "instruction": "Attempt all questions",               │
│           "questions": [                                         │
│             {                                                    │
│               "text": "Question text",                          │
│               "difficulty": "Easy|Moderate|Hard",               │
│               "marks": 2                                         │
│             }                                                    │
│           ]                                                      │
│         }                                                        │
│       ],                                                         │
│       "answerKey": [...]                                         │
│     }
  `;

  await updateProgress(assignmentId, 50)
  emitWebSocket(assignmentId, 'progress', 50);

  // call gemini ai
  const aiResponse = await callGeminiAI(prompt);

  await updateProgress(assignmentId, 80)
  emitWebSocket(assignmentId, 'progress', 80);

  // parse ai response 
  const parsedPaper = parseAiResponse(aiResponse);


  // save to result model 
  const result = await Result.create({
    assignmentId, 
    meta: {
      subject: job.data.subject,
      className: job.data.class,
      duration: job.data.dueDate,
      totalMarks: job.data.totalMarks
    },
    sections: parsedPaper.sections,
    answerKey: parsedPaper.answerKey,
    totalQuestions: job.data.totalQuestions,    
    totalMarks: job.data.totalMarks,
    status: 'completed'
    
  })
  






})