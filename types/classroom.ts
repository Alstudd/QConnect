import type { Classroom, Document } from "@prisma/client";

export interface ClassroomFormData {
  name: string;
  description: string;
  studentEmails: string;
}

export interface DocumentFormData {
  title: string;
  description: string;
  fileName: string;
}

export interface CreateClassroomFormProps {
  onSubmit: (data: Omit<Classroom, "id">) => void;
}

export interface ClassroomSidebarItemProps {
  classroom: Classroom;
  isActive: boolean;
  onClick: () => void;
}

export interface DocumentCardProps {
  document: Document;
}

export interface AddDocumentDialogProps {
  onSubmit: (data: Omit<Document, "id" | "classroomId">) => void;
}
