"use server";
import { db } from "~/server/db";

export async function createClassroom({
  name,
  teacherId,
  description,
}: {
  name: string;
  teacherId: string;
  description: string;
}) {
  const newClassroom = await db.classroom.create({
    data: {
      name,
      description,
      teacherId,
    },
  });

  return newClassroom;
}

export async function getStudentClassrooms(userId: string) {
  const enrolledClasses = await db.enrolledIn.findMany({
    where: {
      studentId: userId,
    },
    include: {
      classroom: true,
    },
  });

  const studentClassrooms = enrolledClasses.map((entry) => entry.classroom);
  return studentClassrooms;
}

export async function getTeacherClassrooms(userId: string) {
  const enrolledClasses = await db.classroom.findMany({
    where: {
      teacherId: userId,
    },
  });
  return enrolledClasses;
}

export async function getClassroomById(classroomId: string) {
  const classroom = await db.classroom.findUnique({
    where: {
      id: classroomId,
    },
    include: {
      Topic: true,
      EnrolledIn: {
        include: {
          student: true,
        },
      },
    },
  });
  return classroom;
}
