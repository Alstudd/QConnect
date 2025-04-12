"use server";
import { db } from "~/server/db";

export async function getNumberOfQuestionsAttempted(userId: string) {
  try {
    const count = await db.attempt.count({
      where: {
        test: {
          studentId: userId,
        },
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting questions attempted:", error);
    throw error;
  }
}
