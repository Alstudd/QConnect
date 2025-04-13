"use server";
import { db } from "~/server/db";

export async function addDocument({
  id,
  title,
  description,
  fileType,
  topicId,
  files,
  states,
}: {
  id: string;
  title: string;
  description?: string;
  fileType?: string;
  topicId: string;
  files: string[];
  states?: any;
}) {
  try {
    // Create the document record
    const document = await db.document.create({
      data: {
        id,
        name: title, // In the schema, Document has 'name' not 'title'
        topicId, // Document is related to Topic, not directly to Classroom
        docUrl:
          files.length > 0
            ? `https://qconnectsm.s3.ap-south-1.amazonaws.com/${files[0]}`
            : "",
      },
    });

    // If states are provided, create state records associated with the topic
    if (states && Array.isArray(states)) {
      const statePromises = states.map((stateName: string) => {
        return db.states.create({
          data: {
            name: stateName,
            topicId: topicId,
          },
        });
      });

      await Promise.all(statePromises);
    }

    return document;
  } catch (error) {
    console.error("Error adding document:", error);
    throw new Error("Failed to add document");
  }
}

// Additional helper function to get documents by topic
export async function getDocumentsByTopic(topicId: string) {
  try {
    const documents = await db.document.findMany({
      where: {
        topicId: topicId,
      },
      orderBy: {
        uploadedOn: "desc",
      },
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

// Function to delete a document
export async function deleteDocument(documentId: string) {
  try {
    await db.document.delete({
      where: {
        id: documentId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}
