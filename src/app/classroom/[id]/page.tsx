"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
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
  Calendar,
  Users,
  ArrowLeft,
  BookOpen,
  Bookmark,
  CheckSquare,
} from "lucide-react";
import { useUser } from "~/components/AuthComponent";
import { getClassroomById } from "~/app/api/manageClassroom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { addTopic } from "~/app/api/manageTopic";
import { createId } from "@paralleldrive/cuid2";
import axios from "axios";
import { Prisma } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Progress } from "~/components/ui/progress";

type ClassroomWithDetails = Prisma.ClassroomGetPayload<{
  include: { Topic: true; EnrolledIn: { include: { student: true } } };
}>;

type TopicCardProps = {
  topic: any;
  onClick: () => void;
  isTeacher: boolean;
};

export default function ClassroomPage() {
  const params = useParams();
  const router = useRouter();
  const classroomId = params.id as string;
  const [classroom, setClassroom] = useState<ClassroomWithDetails | null>(null);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [topicFormData, setTopicFormData] = useState({
    topicName: "",
    topicDesc: "",
  });
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("topics");

  useEffect(() => {
    if (classroomId) {
      fetchClassroomData();
    }
  }, [classroomId]);

  const fetchClassroomData = async () => {
    try {
      const data = await getClassroomById(classroomId);
      setClassroom(data);
    } catch (error) {
      console.error("Error fetching classroom:", error);
    }
  };

  const handleAddTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = createId();

    if (!files) {
      alert("Please provide files for this topic.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    formData.append("id", id);
    const fileNames = Array.from(files).map((file) => file.name);

    try {
      setLoading(true);
      const response = await axios.post(
        "https://qconnect-py-server.onrender.com/upload/",
        formData
      );

      if (response) {
        await addTopic({
          id: id,
          title: topicFormData.topicName,
          description: topicFormData.topicDesc,
          fileType: "pdf",
          files: fileNames,
          states: response.data,
          classId: classroomId,
        });
        await fetchClassroomData();
      }
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
      setIsAddTopicOpen(false);
      setTopicFormData({ topicName: "", topicDesc: "" });
      setFiles(null);
    }
  };

  const navigateToTopic = (topicId: string) => {
    router.push(`/topic/${topicId}`);
  };

  if (!classroom) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 mb-4"></div>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-black dark:text-slate-100">
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="flex items-center" href="/classrooms">
                <Home className="h-4 w-4 mr-2" />
                Classrooms
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{classroom.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-6 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{classroom.name}</h1>
                  <p className="text-slate-500 dark:text-slate-400">
                    {classroom.description || "No description provided"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
                >
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/api/placeholder/40/40" alt="Teacher" />
                  <AvatarFallback>T</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Created by Teacher</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(classroom.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="topics"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="topics" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Topics
                </TabsTrigger>
                <TabsTrigger value="students" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Students
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="topics" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Topics ({classroom.Topic.length})
                  </h2>
                  {user?.isTeacher && (
                    <Dialog
                      open={isAddTopicOpen}
                      onOpenChange={setIsAddTopicOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex items-center">
                          <Plus size={16} className="mr-2" />
                          Add Topic
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Topic</DialogTitle>
                          <DialogDescription>
                            Create a new topic with documents for your students
                            to learn from.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddTopic}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="topicName"
                                className="text-sm font-medium"
                              >
                                Topic Name
                              </label>
                              <Input
                                id="topicName"
                                value={topicFormData.topicName}
                                onChange={(e) =>
                                  setTopicFormData({
                                    ...topicFormData,
                                    topicName: e.target.value,
                                  })
                                }
                                placeholder="e.g., Introduction to Algebra"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="topicDesc"
                                className="text-sm font-medium"
                              >
                                Description
                              </label>
                              <Textarea
                                id="topicDesc"
                                value={topicFormData.topicDesc}
                                onChange={(e) =>
                                  setTopicFormData({
                                    ...topicFormData,
                                    topicDesc: e.target.value,
                                  })
                                }
                                placeholder="Brief description of this topic"
                                rows={3}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="files"
                                className="text-sm font-medium"
                              >
                                Upload Documents
                              </label>
                              <div className="flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                                <input
                                  type="file"
                                  id="files"
                                  className="hidden"
                                  accept=".pdf"
                                  onChange={(e) => setFiles(e.target.files)}
                                  multiple
                                />
                                <label
                                  htmlFor="files"
                                  className="cursor-pointer text-center"
                                >
                                  <Upload
                                    size={24}
                                    className="mx-auto mb-2 text-slate-400"
                                  />
                                  <p className="text-sm font-medium mb-1">
                                    Click to upload PDFs
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {files
                                      ? `${files.length} file(s) selected`
                                      : "No files selected"}
                                  </p>
                                </label>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsAddTopicOpen(false)}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Adding..." : "Add Topic"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {classroom.Topic.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classroom.Topic.map((topic) => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        onClick={() => navigateToTopic(topic.id)}
                        isTeacher={user?.isTeacher || false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <BookOpen
                      size={48}
                      className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2">No topics yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      {user?.isTeacher
                        ? "Start by adding a topic to help organize your classroom content"
                        : "Your teacher hasn't added any topics yet"}
                    </p>
                    {user?.isTeacher && (
                      <Button
                        onClick={() => setIsAddTopicOpen(true)}
                        className="flex items-center mx-auto"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Your First Topic
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Students ({classroom.EnrolledIn?.length || 0})
                  </h2>
                  {user?.isTeacher && (
                    <Button className="flex items-center">
                      <Plus size={16} className="mr-2" />
                      Invite Students
                    </Button>
                  )}
                </div>

                {classroom.EnrolledIn && classroom.EnrolledIn.length > 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                    <ScrollArea className="h-[400px] rounded-md">
                      <div className="p-4">
                        {classroom.EnrolledIn.map((enrollment, index) => (
                          <React.Fragment key={enrollment.id}>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-4">
                                  <AvatarImage src="/api/placeholder/32/32" />
                                  <AvatarFallback>
                                    {enrollment.student.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {enrollment.student.name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {enrollment.student.email}
                                  </p>
                                </div>
                              </div>
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2">
                                      Active
                                    </Badge>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreVertical size={16} />
                                    </Button>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold">
                                      Student Progress
                                    </h4>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Topics Completed</span>
                                        <span className="font-medium">
                                          2/{classroom.Topic.length}
                                        </span>
                                      </div>
                                      <Progress
                                        value={
                                          (2 / classroom.Topic.length) * 100
                                        }
                                        className="h-2"
                                      />
                                    </div>
                                    <div className="pt-2">
                                      <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Joined{" "}
                                        {new Date(
                                          enrollment.joinedAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                            {index < classroom.EnrolledIn.length - 1 && (
                              <Separator className="my-2" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <Users
                      size={48}
                      className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2">
                      No students enrolled
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      {user?.isTeacher
                        ? "Invite students to join your classroom by sharing the enrollment link"
                        : "There are no other students enrolled in this classroom yet"}
                    </p>
                    {user?.isTeacher && (
                      <Button className="flex items-center mx-auto">
                        <Plus size={16} className="mr-2" />
                        Invite Students
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        Average Completion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">68%</div>
                      <Progress value={68} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        Active Students
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {classroom.EnrolledIn?.length || 0}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Last activity: Today
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        Average Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">85%</div>
                      <Progress value={85} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Topic Performance</CardTitle>
                    <CardDescription>
                      Student performance across topics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {classroom.Topic.map((topic) => (
                        <div key={topic.id}>
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-sm font-medium">
                              {topic.title}
                            </h4>
                            <span className="text-sm text-slate-500">75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      ))}
                      {classroom.Topic.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          No topics available to analyze
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="md:w-1/4">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("topics")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Topics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("students")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
                {user?.isTeacher && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsAddTopicOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Topic
                    </Button>
                    {/* <Button variant="outline" className="w-full justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Test
                    </Button> */}
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Classroom Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span>
                    {new Date(classroom.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Topics</span>
                  <span>{classroom.Topic.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Students</span>
                  <span>{classroom.EnrolledIn?.length || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Activity</span>
                  <span>Today</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push("/classrooms")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Classrooms
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopicCard({ topic, onClick, isTeacher }: TopicCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-semibold truncate">
              {topic.title}
            </CardTitle>
            <CardDescription className="truncate">
              {topic.description || "No description provided"}
            </CardDescription>
          </div>
          {isTeacher && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <div className="flex items-center">
            <File size={14} className="mr-1" />
            <span>{topic.fileType || "PDF"}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(topic.createdOn).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between bg-slate-50 dark:bg-slate-800/50">
        <Button variant="link" size="sm" className="px-0">
          View Topic
        </Button>
        {isTeacher && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              // Delete functionality
            }}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
