"use server";
import { db } from "~/server/db";

export async function getNumberOfTestsTaken(userId: string) {
  try {
    const count = await db.test.count({
      where: {
        studentId: userId,
        submittedAt: {
          not: null, // Only count submitted tests
        },
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting test count:", error);
    throw error;
  }
}
