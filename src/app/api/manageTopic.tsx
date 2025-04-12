"use server";
import { db } from "~/server/db";

type AddContentProps = {
  id: string;
  title: string;
  description?: string;
  fileType?: string;
  classId: string;
  files: string[];
  states: string[];
};

export async function addTopic({
  id,
  title,
  description,
  fileType,
  classId,
  files,
  states,
}: AddContentProps) {
  try {
    const content = await db.topic.create({
      data: {
        id,
        title,
        description,
        fileType,
        classId,
      },
    });

    const docData = files.map((name) => {
      return {
        name: name,
        topicId: content.id,
        docUrl: `https://qconnectsm.s3.ap-south-1.amazonaws.com/${name}`,
      };
    });

    await db.document.createMany({
      data: docData,
    });

    const stateData = states.map((s) => {
      return { name: s, topicId: content.id };
    });

    await db.states.createMany({
      data: stateData,
    });

    return content;
  } catch (error) {
    console.error("Error adding content:", error);
    throw new Error("Failed to add content");
  }
}

export async function getTopicByClassroom(topicId) {
  try {
    const topic = await db.topic.findUnique({
      where: { id: topicId },
      include: {
        classroom: true,
      },
    });

    if (!topic) {
      throw new Error("Topic not found");
    }

    return topic;
  } catch (error) {
    console.error("Error fetching topic:", error);
    throw error;
  }
}
