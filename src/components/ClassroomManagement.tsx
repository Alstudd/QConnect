"use client";
import React, { useState, useEffect } from "react";
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
import {
  createClassroom,
  getTeacherClassrooms,
} from "~/app/api/manageClassroom";
import type {
  DocumentCardProps,
  DocumentFormData,
  ClassroomSidebarItemProps,
  CreateClassroomFormProps,
  AddDocumentDialogProps,
  ClassroomFormData,
} from "../../types/classroom";
import axios from "axios";
import { createId } from "@paralleldrive/cuid2";
import type { Topic } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { addTopic } from "~/app/api/manageTopic";

type ClassroomsWithTopic = Prisma.ClassroomGetPayload<{
  include: { Topic: true };
}>;

export default function ClassroomManagementUI() {
  const [selectedClassroom, setSelectedClassroom] =
    useState<ClassroomsWithTopic | null>(null);
  const { user } = useUser();
  const [classrooms, setClassrooms] = useState<ClassroomsWithTopic[]>([]);
  const [topic, setTopic] = useState<Topic[]>([]);

  useEffect(() => {
    getClassrooms();
  }, [user]);

  const getClassrooms = async () => {
    if (user) {
      if (user.isTeacher) {
        const res = await getTeacherClassrooms(user.id);
        console.log(res);
        setClassrooms(res);
      }
    }
  };

  // const filteredDocuments = selectedClassroom
  //   ? documents.filter((doc) => doc.classroomId === selectedClassroom.id)
  //   : [];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-black text-black dark:text-slate-100">
      <div className="w-64 bg-white dark:bg-black border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold">QConnect</h2>
        </div>

        {user?.isTeacher && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <CreateClassroomForm updateClassrooms={getClassrooms} />
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
                  onClick={() => {
                    setSelectedClassroom(classroom), setTopic(classroom.Topic);
                  }}
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
                <AddDocumentDialog classId={selectedClassroom.id} />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topic.map((t) => (
                <DocumentCard key={t.id} topic={t} />
              ))}

              {topic.length === 0 && (
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
                      <AddDocumentDialog classId={selectedClassroom.id} />
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

export async function sendClassroomInvites({
  classroomId,
  classroomName,
  emails,
  teacherName
}: {
  classroomId: string;
  classroomName: string;
  emails: string[];
  teacherName: string;
}): Promise<boolean> {
  try {
    if (!classroomId || !emails.length || !classroomName) {
      console.error("Missing required parameters for sending invitations");
      return false;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || window.location.origin;
    const joinUrl = `${baseUrl}/join/${classroomId}`;
    
    const response = await fetch('/api/sendMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subject: `Invitation to join ${classroomName}`,
        message: `You have been invited to join a classroom on QConnect`,
        emails: emails,
        classroomName: classroomName,
        classroomId: classroomId,
        teacherName: teacherName,
        joinUrl: joinUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send invitations: ${errorData.message}`);
    }

    const data = await response.json();
    console.log("Invitations sent successfully:", data);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error sending classroom invitations:", error.message);
    } else {
      console.error("Unexpected error sending classroom invitations:", error);
    }
    return false;
  }
}

function CreateClassroomForm({
  updateClassrooms,
}: {
  updateClassrooms: VoidFunction;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: "",
    description: "",
    studentEmails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newClassroom = await createClassroom({
        name: formData.name,
        teacherId: user?.id!,
        description: formData.description,
      });

      await updateClassrooms();

      const emailsArray = formData.studentEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email && email.includes("@"));

      if (emailsArray.length > 0 && newClassroom?.id) {
        await sendClassroomInvites({
          classroomId: newClassroom.id,
          classroomName: formData.name,
          emails: emailsArray,
          teacherName: user?.name || "Your teacher",
        });
      }

      setFormData({ name: "", description: "", studentEmails: "" });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Failed to create classroom. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

function DocumentCard({ topic }: { topic: Topic }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-semibold truncate">
              {topic.title}
            </CardTitle>
            <CardDescription className="truncate">
              {topic.description}
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
          <span className="truncate">file</span>
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

function AddDocumentDialog({ classId }: { classId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ topicName: "", topicDesc: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = createId();

    if (!files) {
      alert("Please provide both files and an ID.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("id", id);
    const fileNames = Array.from(files).map((file) => file.name);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:8000/upload/",
        formData
      );

      if (response) {
        console.log(response.data);
        await addTopic({
          id: id,
          title: data.topicName,
          description: data.topicDesc,
          fileType: "pdf",
          files: fileNames,
          states: response.data,
          classId: classId,
        });
      }
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
    }

    setIsOpen(false);
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
                  onChange={(e) => {
                    setFiles(e.target.files);
                  }}
                  multiple
                />
                <label htmlFor="file" className="cursor-pointer text-center">
                  <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-slate-500">{data.topicName}</p>
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
                value={data.topicName}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, topicName: e.target.value }));
                }}
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
                value={data.topicDesc}
                onChange={(e) => {
                  setData((prev) => ({ ...prev, topicDesc: e.target.value }));
                }}
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
