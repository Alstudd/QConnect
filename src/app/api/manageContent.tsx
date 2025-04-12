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
