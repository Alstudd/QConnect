"use server";
import axios from "axios";
import { db } from "~/server/db";

export async function generateQuestion(state: string, topicId: string) {
  const prompt = `
    You are generating a multiple-choice question of type: "${state}".
    
    Generate exactly one question and respond ONLY with a **valid JSON** in the following format:
    {
      "questionText": "...",
      "correctOption": "...",
      "options": ["...", "...", "...", "..."]
    }
    
    IMPORTANT:
    - The "correctOption" MUST exactly match one of the entries in the "options" array.
    - The "options" array MUST contain 4 unique strings, including the correct answer.
    - Do not include any extra text outside the JSON.
    
    Make sure the question is relevant to the topic and matches the level of difficulty implied by "${state}".
    `;

  const formData = new FormData();
  formData.append("id", topicId);
  formData.append("query", prompt);

  const rawResponse = await axios.post(
    "https://qconnect-py-server.onrender.com/query",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const res = JSON.parse(rawResponse.data.join(""));

  const q = await db.question.create({
    data: {
      questionText: res.questionText,
      options: res.options.join("-"),
      correctOption: res.correctOption,
      topicId: topicId,
    },
  });

  return q;
}

export async function submitAnswer({
  qid,
  isCorrect,
  testId,
  answer,
  timeTaken,
}: {
  qid: string;
  isCorrect: boolean;
  testId: string;
  answer: string;
  timeTaken: number;
}) {
  const attempt = await db.attempt.create({
    data: {
      questionId: qid,
      isCorrect: isCorrect,
      testId: testId,
      selectedOption: answer,
      timeTaken: timeTaken,
    },
  });

  return attempt;
}
