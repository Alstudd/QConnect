"use client";
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import {
  ChevronRight,
  Book,
  File,
  Plus,
  Upload,
  Trash2,
  MoreVertical,
  Home,
  Settings,
  LogOut,
  Brain,
} from "lucide-react";
import { useUser } from "./AuthComponent";
import { createClassroom } from "~/app/api/manageClassroom";

interface Classroom {
  id: number;
  name: string;
  description: string;
  studentEmails: string[];
}

interface Document {
  id: number;
  classroomId: number;
  title: string;
  description: string;
  fileName: string;
}

interface ClassroomFormData {
  name: string;
  description: string;
  studentEmails: string;
}

interface DocumentFormData {
  title: string;
  description: string;
  fileName: string;
}

interface CreateClassroomFormProps {
  onSubmit: (data: Omit<Classroom, "id">) => void;
}

interface ClassroomSidebarItemProps {
  classroom: Classroom;
  isActive: boolean;
  onClick: () => void;
}

interface DocumentCardProps {
  document: Document;
}

interface AddDocumentDialogProps {
  onSubmit: (data: Omit<Document, "id" | "classroomId">) => void;
}

export default function ClassroomManagementUI() {
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(
    null
  );
  const { user } = useUser();
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: 1,
      name: "Math 101",
      description: "Introduction to Algebra",
      studentEmails: ["student1@example.com", "student2@example.com"],
    },
    {
      id: 2,
      name: "History 202",
      description: "World History",
      studentEmails: ["student3@example.com", "student4@example.com"],
    },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      classroomId: 1,
      title: "Algebra Basics",
      description: "Fundamental concepts of algebra",
      fileName: "algebra_basics.pdf",
    },
    {
      id: 2,
      classroomId: 1,
      title: "Quadratic Equations",
      description: "How to solve quadratic equations",
      fileName: "quadratics.pdf",
    },
    {
      id: 3,
      classroomId: 2,
      title: "Ancient Civilizations",
      description: "Overview of early human societies",
      fileName: "ancient_civs.pdf",
    },
  ]);

  const filteredDocuments = selectedClassroom
    ? documents.filter((doc) => doc.classroomId === selectedClassroom.id)
    : [];

  const handleCreateClassroom = (data: Omit<Classroom, "id">): void => {
    const newClassroom: Classroom = {
      id: classrooms.length + 1,
      ...data,
    };
    setClassrooms([...classrooms, newClassroom]);
    setSelectedClassroom(newClassroom);
  };

  const handleCreateDocument = (
    data: Omit<Document, "id" | "classroomId">
  ): void => {
    if (selectedClassroom) {
      const newDocument: Document = {
        id: documents.length + 1,
        classroomId: selectedClassroom.id,
        ...data,
      };
      setDocuments([...documents, newDocument]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black text-black dark:text-slate-100">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-black border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">QConnect</h2>
        </div>

        {user?.isTeacher && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <CreateClassroomForm onSubmit={handleCreateClassroom} />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
              YOUR CLASSROOMS
            </h3>
            <ScrollArea className="h-full">
              {classrooms.map((classroom) => (
                <ClassroomSidebarItem
                  key={classroom.id}
                  classroom={classroom}
                  isActive={selectedClassroom?.id === classroom.id}
                  onClick={() => setSelectedClassroom(classroom)}
                />
              ))}
            </ScrollArea>
          </div>
        </div>

        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" alt="Teacher" />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">Teacher Name</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LogOut size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {selectedClassroom ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold">{selectedClassroom.name}</h1>
              <p className="text-slate-500 dark:text-slate-400">
                {selectedClassroom.description}
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              {user?.isTeacher && (
                <AddDocumentDialog onSubmit={handleCreateDocument} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocuments.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}

              {filteredDocuments.length === 0 && (
                <div className="col-span-full flex justify-center items-center p-12 bg-slate-100 dark:bg-black rounded-lg">
                  <div className="text-center">
                    <Book
                      size={48}
                      className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
                    />
                    <h3 className="font-medium mb-2">No documents yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      {user?.isTeacher
                        ? "Upload a document to get started"
                        : "Your teacher hasn't uploaded any documents yet"}
                    </p>
                    {user?.isTeacher && (
                      <AddDocumentDialog onSubmit={handleCreateDocument} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <Brain size={48} className="mx-auto text-slate-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                Welcome to QConnect
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {user?.isTeacher
                  ? "Select a classroom or create a new one to get started"
                  : "Select a classroom to get started"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CreateClassroomForm Component
function CreateClassroomForm({ onSubmit }: CreateClassroomFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: "",
    description: "",
    studentEmails: "",
  });
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createClassroom({
      name: formData.name,
      teacherId: user?.id!,
      description: formData.description,
    });

    const emailsArray = formData.studentEmails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email);

    onSubmit({
      name: formData.name,
      description: formData.description,
      studentEmails: emailsArray,
    });

    setFormData({ name: "", description: "", studentEmails: "" });
    setIsDialogOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="sm">
          <Plus size={16} className="mr-2" />
          New Classroom
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new virtual classroom.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Classroom Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Math 101"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's this classroom about?"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="studentEmails" className="text-sm font-medium">
                Student Emails
              </label>
              <Textarea
                id="studentEmails"
                name="studentEmails"
                value={formData.studentEmails}
                onChange={handleChange}
                placeholder="Enter student emails separated by commas"
                rows={3}
              />
              <p className="text-xs text-slate-500">
                Separate multiple email addresses with commas
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Classroom</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ClassroomSidebarItem Component
function ClassroomSidebarItem({
  classroom,
  isActive,
  onClick,
}: ClassroomSidebarItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start mb-1 ${
        isActive
          ? "bg-slate-100 text-black dark:bg-slate-800 dark:text-white"
          : ""
      }`}
      onClick={onClick}
    >
      <Book size={16} className="mr-2" />
      <span className="truncate">{classroom.name}</span>
      {isActive && <ChevronRight size={16} className="ml-auto" />}
    </Button>
  );
}

// Document Card Component
function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-semibold truncate">
              {document.title}
            </CardTitle>
            <CardDescription className="truncate">
              {document.description}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Card className="flex flex-row p-3 items-center text-sm text-slate-500">
          <File size={14} className="ml-1" />
          <span className="truncate">{document.fileName}</span>
        </Card>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
          <Trash2 size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Add Document Dialog Component
function AddDocumentDialog({ onSubmit }: AddDocumentDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<DocumentFormData>({
    title: "",
    description: "",
    fileName: "No file selected",
  });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: "", description: "", fileName: "No file selected" });
    setIsOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: any): void => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        fileName: e.target.files[0].name,
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus size={16} className="mr-2" />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add a new document to this classroom.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="file" className="text-sm font-medium">
                Upload PDF
              </label>
              <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-6 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="file" className="cursor-pointer text-center">
                  <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-slate-500">{formData.fileName}</p>
                </label>
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Document Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Chapter 1 Notes"
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="doc-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="doc-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
