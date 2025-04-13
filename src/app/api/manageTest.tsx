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

export async function getTestsByTopicId(topicId: string) {
  try {
    const tests = await db.test.findMany({
      where: {
        topicId: topicId,
      },
    });
    return tests;
  } catch (error) {
    console.error("Error getting tests:", error);
    throw error;
  }
}

export async function createTest({
  topicId,
  studentId,
}: {
  topicId: string;
  studentId: string;
}) {
  const test = await db.test.create({
    data: {
      topicId: topicId,
      studentId: studentId,
    },
  });

  return test;
}
