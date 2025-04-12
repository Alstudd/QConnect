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
  FileText,
  Clock,
  Star,
  PenTool,
  Play,
  BarChart,
  ListChecks,
} from "lucide-react";
import { useUser } from "~/components/AuthComponent";
import { getTopicById } from "~/app/api/manageTopic";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { addDocument } from "~/app/api/manageDocument";
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

type TopicWithDetails = Prisma.TopicGetPayload<{
  include: { 
    Document: true; 
    Test: true; 
    classroom: true;
  };
}>;

type DocumentCardProps = {
  document: any;
  onClick: () => void;
  isTeacher: boolean;
};

type TestCardProps = {
  test: any;
  onClick: () => void;
  isTeacher: boolean;
};

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.id as string;
  const [topic, setTopic] = useState<TopicWithDetails | null>(null);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ documentName: "", documentDesc: "" });
  const [testFormData, setTestFormData] = useState({ testName: "", testDesc: "", duration: 30 });
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("documents");

  useEffect(() => {
    if (topicId) {
      fetchTopicData();
    }
  }, [topicId]);

  const fetchTopicData = async () => {
    try {
      const data: any = await getTopicById(topicId);
      setTopic(data);
    } catch (error) {
      console.error("Error fetching topic:", error);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = createId();

    if (!files) {
      alert("Please provide files for this document.");
      return;
    }

    const documentFormData: any = new FormData();
    Array.from(files).forEach((file) => documentFormData.append("files", file));
    documentFormData.append("id", id);
    const fileNames = Array.from(files).map((file) => file.name);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://3.109.48.9:8000/upload/",
        documentFormData
      );

      if (response) {
        await addDocument({
          id: id,
          title: formData.documentName,
          description: formData.documentDesc,
          fileType: "pdf",
          files: fileNames,
          states: response.data,
          topicId: topicId,
        });
        await fetchTopicData();
      }
    } catch (error: any) {
      console.error(error);
      alert("Upload failed: " + error.message);
    } finally {
      setLoading(false);
      setIsAddDocumentOpen(false);
      setFormData({ documentName: "", documentDesc: "" });
      setFiles(null);
    }
  };

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your test creation logic here
    setIsCreateTestOpen(false);
    setTestFormData({ testName: "", testDesc: "", duration: 30 });
  };

  const navigateToDocument = (documentId: string) => {
    router.push(`/document/${documentId}`);
  };

  const navigateToTest = (testId: string) => {
    router.push(`/test/${testId}`);
  };

  const navigateToClassroom = (classroomId: string) => {
    router.push(`/classrooms/${classroomId}`);
  };

  if (!topic) {
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

  // Safely check if classroom exists before accessing its properties
  const classroomId = topic.classroom?.id || '';
  const classroomName = topic.classroom?.name || 'Classroom';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-black dark:text-slate-100">
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/classrooms">
                <Home className="h-4 w-4 mr-2" />
                Classrooms
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/classrooms/${classroomId}`}>
                {classroomName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{topic.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 mb-6 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{topic.title}</h1>
                  <p className="text-slate-500 dark:text-slate-400">
                    {topic.description || "No description provided"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                  >
                    Topic
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
                  >
                    Active
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                  <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {topic.Document?.length || 0} Documents • {topic.Test?.length || 0} Tests
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Created on {new Date(topic.createdOn).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="documents"
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-6"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="documents" className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex items-center">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tests
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Documents ({topic.Document?.length || 0})
                  </h2>
                  {user?.isTeacher && (
                    <Dialog
                      open={isAddDocumentOpen}
                      onOpenChange={setIsAddDocumentOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex items-center">
                          <Plus size={16} className="mr-2" />
                          Add Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Document</DialogTitle>
                          <DialogDescription>
                            Upload study materials for this topic.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddDocument}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="documentName"
                                className="text-sm font-medium"
                              >
                                Document Title
                              </label>
                              <Input
                                id="documentName"
                                value={formData.documentName}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    documentName: e.target.value,
                                  })
                                }
                                placeholder="e.g., Introduction to Variables"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="documentDesc"
                                className="text-sm font-medium"
                              >
                                Description
                              </label>
                              <Textarea
                                id="documentDesc"
                                value={formData.documentDesc}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    documentDesc: e.target.value,
                                  })
                                }
                                placeholder="Brief description of this document"
                                rows={3}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="files"
                                className="text-sm font-medium"
                              >
                                Upload Files
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
                              onClick={() => setIsAddDocumentOpen(false)}
                              disabled={loading}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                              {loading ? "Adding..." : "Add Document"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {topic.Document && topic.Document.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topic.Document.map((document) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        onClick={() => navigateToDocument(document.id)}
                        isTeacher={user?.isTeacher || false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <FileText
                      size={48}
                      className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2">
                      No documents yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      {user?.isTeacher
                        ? "Add documents to provide learning materials for this topic"
                        : "Your teacher hasn't added any documents yet"}
                    </p>
                    {user?.isTeacher && (
                      <Button
                        onClick={() => setIsAddDocumentOpen(true)}
                        className="flex items-center mx-auto"
                      >
                        <Plus size={16} className="mr-2" />
                        Add Your First Document
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Tests ({topic.Test?.length || 0})
                  </h2>
                  {user?.isTeacher && (
                    <Dialog
                      open={isCreateTestOpen}
                      onOpenChange={setIsCreateTestOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="flex items-center">
                          <Plus size={16} className="mr-2" />
                          Create Test
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Create New Test</DialogTitle>
                          <DialogDescription>
                            Create an assessment for students to test their knowledge.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateTest}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="testName"
                                className="text-sm font-medium"
                              >
                                Test Name
                              </label>
                              <Input
                                id="testName"
                                value={testFormData.testName}
                                onChange={(e) =>
                                  setTestFormData({
                                    ...testFormData,
                                    testName: e.target.value,
                                  })
                                }
                                placeholder="e.g., Chapter 1 Quiz"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="testDesc"
                                className="text-sm font-medium"
                              >
                                Description
                              </label>
                              <Textarea
                                id="testDesc"
                                value={testFormData.testDesc}
                                onChange={(e) =>
                                  setTestFormData({
                                    ...testFormData,
                                    testDesc: e.target.value,
                                  })
                                }
                                placeholder="Brief description of this test"
                                rows={3}
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="duration"
                                className="text-sm font-medium"
                              >
                                Duration (minutes)
                              </label>
                              <Input
                                id="duration"
                                type="number"
                                value={testFormData.duration}
                                onChange={(e) =>
                                  setTestFormData({
                                    ...testFormData,
                                    duration: parseInt(e.target.value) || 30,
                                  })
                                }
                                min={5}
                                max={180}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsCreateTestOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              Create Test
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {topic.Test && topic.Test.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topic.Test.map((test) => (
                      <TestCard
                        key={test.id}
                        test={test}
                        onClick={() => navigateToTest(test.id)}
                        isTeacher={user?.isTeacher || false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
                    <CheckSquare
                      size={48}
                      className="mx-auto text-slate-400 dark:text-slate-500 mb-4"
                    />
                    <h3 className="text-lg font-medium mb-2">
                      No tests available
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      {user?.isTeacher
                        ? "Create tests to assess student understanding of this topic"
                        : "Your teacher hasn't created any tests for this topic yet"}
                    </p>
                    {user?.isTeacher && (
                      <Button
                        onClick={() => setIsCreateTestOpen(true)}
                        className="flex items-center mx-auto"
                      >
                        <Plus size={16} className="mr-2" />
                        Create Your First Test
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
                        Avg. Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">76%</div>
                      <Progress value={76} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        Time Spent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        45 min
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Average per student
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md font-medium">
                        Test Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">82%</div>
                      <Progress value={82} className="h-2 mt-2" />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Document Engagement</CardTitle>
                    <CardDescription>
                      Student engagement with learning materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topic.Document && topic.Document.length > 0 ? (
                        topic.Document.map((document: any) => (
                          <div key={document.id}>
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="text-sm font-medium truncate">
                                {document.title}
                              </h4>
                              <span className="text-sm text-slate-500">80%</span>
                            </div>
                            <Progress value={80} className="h-2" />
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          No documents available to analyze
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
                  onClick={() => setActiveTab("documents")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Documents
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("tests")}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  View Tests
                </Button>
                {user?.isTeacher && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsAddDocumentOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Document
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setIsCreateTestOpen(true)}
                    >
                      <PenTool className="mr-2 h-4 w-4" />
                      Create Test
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Topic Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span>
                    {new Date(topic.createdOn).toLocaleDateString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Documents</span>
                  <span>{topic.Document?.length || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Tests</span>
                  <span>{topic.Test?.length || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-slate-500">Last Updated</span>
                  <span>3 days ago</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigateToClassroom(classroomId)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to {classroomName}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ document, onClick, isTeacher }: DocumentCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-semibold truncate">
              {document.title}
            </CardTitle>
            <CardDescription className="truncate">
              {document.description || "No description provided"}
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
            <FileText size={14} className="mr-1" />
            <span>{document.fileType || "PDF"}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between bg-slate-50 dark:bg-slate-800/50">
        <Button variant="link" size="sm" className="px-0">
          Read Document
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

function TestCard({ test, onClick, isTeacher }: TestCardProps) {
  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-md font-semibold truncate">
              {test.title}
            </CardTitle>
            <CardDescription className="truncate">
              {test.description || "No description provided"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800"
          >
            Test
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center text-sm text-slate-500 space-x-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{test.duration || 30} mins</span>
          </div>
          <div className="flex items-center">
            <ListChecks size={14} className="mr-1" />
            <span>{test.questionCount || 10} questions</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="default" size="sm" className="space-x-1">
          <Play size={14} className="mr-1" />
          {isTeacher ? "Preview Test" : "Take Test"}
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
  