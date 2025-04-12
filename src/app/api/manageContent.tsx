"use server";
import { db } from "~/server/db";

type AddContentProps = {
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  classId: string;
};

export async function addContent({
  title,
  description,
  url,
  fileType,
  classId,
}: AddContentProps) {
  try {
    const content = await db.content.create({
      data: {
        title,
        description,
        url,
        fileType,
        classId,
      },
    });

    return content;
  } catch (error) {
    console.error("Error adding content:", error);
    throw new Error("Failed to add content");
  }
}

export async function getClassroomContent(classId: string) {
  try {
    const contentList = await db.content.findMany({
      where: {
        classId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

    return contentList;
  } catch (error) {
    console.error("Failed to fetch content:", error);
    throw new Error("Could not fetch content for the selected classroom.");
  }
}
