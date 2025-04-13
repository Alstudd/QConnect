"use server";
import { db } from "~/server/db";

type EnrollStudentProps = {
  classId: string;
  studentId: string;
};

export async function enrollStudent({
  classId,
  studentId,
}: EnrollStudentProps) {
  try {
    const isAlreadyEnrolled = await db.enrolledIn.findFirst({
      where: {
        classId,
        studentId,
      },
    });

    if (isAlreadyEnrolled) {
      return isAlreadyEnrolled;
    }

    const enrollment = await db.enrolledIn.create({
      data: {
        classId,
        studentId,
      },
    });

    return enrollment;
  } catch (error) {
    console.error("Enrollment failed:", error);
    throw new Error("Failed to enroll student");
  }
}

export async function getNumberOfClassesEnrolled(studentId: string) {
  try {
    const count = await db.enrolledIn.count({
      where: {
        studentId: studentId,
      },
    });
    return count;
  } catch (error) {
    console.error("Error fetching class count:", error);
    throw error;
  }
}
