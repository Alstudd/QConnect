"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ChevronRight,
  BarChart,
  BrainCircuit,
  Zap,
  Rocket,
  HelpCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOption: string;
}

interface QuizProps {
  contentId: string;
  testId?: string;
}

// Dummy data for testing
const dummyQuestions: Question[] = [
  {
    id: "q1",
    questionText: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctOption: "Paris",
  },
  {
    id: "q2",
    questionText: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctOption: "Mars",
  },
  {
    id: "q3",
    questionText: "What is the largest mammal on Earth?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctOption: "Blue Whale",
  },
  {
    id: "q4",
    questionText: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "Jane Austen",
      "William Shakespeare",
      "Mark Twain",
    ],
    correctOption: "William Shakespeare",
  },
  {
    id: "q5",
    questionText: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctOption: "Au",
  },
  {
    id: "q6",
    questionText: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "United States", "Australia", "Thailand"],
    correctOption: "Australia",
  },
  {
    id: "q7",
    questionText: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correctOption: "7",
  },
  {
    id: "q8",
    questionText: "What is the largest organ in the human body?",
    options: ["Heart", "Liver", "Skin", "Brain"],
    correctOption: "Skin",
  },
  {
    id: "q9",
    questionText: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correctOption: "Carbon Dioxide",
  },
  {
    id: "q10",
    questionText: "What is the tallest mountain in the world?",
    options: ["K2", "Mont Blanc", "Mount Everest", "Kilimanjaro"],
    correctOption: "Mount Everest",
  },
  {
    id: "q11",
    questionText: "Who painted the Mona Lisa?",
    options: [
      "Pablo Picasso",
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Michelangelo",
    ],
    correctOption: "Leonardo da Vinci",
  },
  {
    id: "q12",
    questionText: "What is the hardest natural substance on Earth?",
    options: ["Titanium", "Diamond", "Steel", "Quartz"],
    correctOption: "Diamond",
  },
];

// Mock API functions
const mockApiCalls = {
  getQuestions: (contentId: string, difficulty: string, exclude = "") => {
    // Filter questions based on exclude list
    const excludeIds = exclude ? exclude.split(",") : [];
    let filteredQuestions = dummyQuestions.filter(
      (q) => !excludeIds.includes(q.id)
    );

    // Get 3 random questions
    const randomQuestions = [];
    const count = Math.min(3, filteredQuestions.length);

    for (let i = 0; i < count; i++) {
      if (filteredQuestions.length === 0) break;
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      randomQuestions.push(filteredQuestions[randomIndex]);
      filteredQuestions.splice(randomIndex, 1);
    }

    return Promise.resolve({ data: randomQuestions });
  },
  getTest: (testId: string) => {
    return Promise.resolve({ data: { id: testId || "test123" } });
  },
  createTest: (contentId: string) => {
    return Promise.resolve({ data: { id: "test123" } });
  },
  submitAttempt: (data: any) => {
    console.log("Submitting attempt:", data);
    return Promise.resolve({ data: { success: true } });
  },
  finalizeTest: (testId: string, data: any) => {
    console.log("Finalizing test:", testId, data);
    return Promise.resolve({ data: { success: true } });
  },
};

const MCQQuiz: React.FC<QuizProps> = ({ contentId, testId }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<
    Array<{ questionId: string; selectedOption: string; isCorrect: boolean }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [showFeedback, setShowFeedback] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [streak, setStreak] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [nextQuestionLoading, setNextQuestionLoading] = useState(false);

  useEffect(() => {
    if (loading || quizCompleted || showResults) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (selectedOption === null) {
            handleTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    loading,
    quizCompleted,
    showResults,
    selectedOption,
    currentQuestionIndex,
  ]);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);

        // Use actual API calls with fallback to mock data
        try {
          const existingTest = testId
            ? await axios.get(`/api/tests/${testId}`)
            : await axios.post("/api/tests", { contentId });

          const currentTestId = testId || existingTest.data.id;

          const response = await axios.get(
            `/api/questions?contentId=${contentId}&difficulty=${difficulty}`
          );
          setQuestions(response.data);
        } catch (error) {
          console.log("Using mock data instead:", error);
          const mockResponse: any = await mockApiCalls.getQuestions(
            contentId,
            difficulty
          );
          setQuestions(mockResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to load questions:", error);
        setLoading(false);
      }
    };

    loadQuestions();
  }, [contentId, testId]);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption !== null || nextQuestionLoading) return;

    setSelectedOption(option);
    const currentQuestion: any = questions[currentQuestionIndex];
    const correct = option === currentQuestion.correctOption;
    setIsCorrect(correct);

    if (correct) {
      setScore((prev) => prev + 100 + Math.floor(timeRemaining * 1.5));
      setStreak((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setStreak(0);
    }

    const newAttempt = {
      questionId: currentQuestion.id,
      selectedOption: option,
      isCorrect: correct,
    };

    setAttempts((prev) => [...prev, newAttempt]);

    try {
      // Try to use real API, fallback to mock
      try {
        await axios.post("/api/attempts", {
          testId: testId,
          questionId: currentQuestion.id,
          selectedOption: option,
          isCorrect: correct,
        });
      } catch (error) {
        await mockApiCalls.submitAttempt({
          testId: testId,
          questionId: currentQuestion.id,
          selectedOption: option,
          isCorrect: correct,
        });
      }
    } catch (error) {
      console.error("Failed to save attempt:", error);
    }

    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      handleNextQuestion(correct);
    }, 2000);
  };

  const handleTimeUp = async () => {
    const currentQuestion: any = questions[currentQuestionIndex];
    const newAttempt = {
      questionId: currentQuestion.id,
      selectedOption: "timeout",
      isCorrect: false,
    };

    setAttempts((prev) => [...prev, newAttempt]);
    setStreak(0);

    try {
      // Try to use real API, fallback to mock
      try {
        await axios.post("/api/attempts", {
          testId: testId,
          questionId: currentQuestion.id,
          selectedOption: "timeout",
          isCorrect: false,
        });
      } catch (error) {
        await mockApiCalls.submitAttempt({
          testId: testId,
          questionId: currentQuestion.id,
          selectedOption: "timeout",
          isCorrect: false,
        });
      }
    } catch (error) {
      console.error("Failed to save attempt:", error);
    }

    handleNextQuestion(false);
  };

  const handleNextQuestion = async (wasCorrect: boolean) => {
    setNextQuestionLoading(true);
    let newDifficulty = difficulty;
    if (streak >= 3) {
      newDifficulty = "hard";
    } else if (wasCorrect) {
      if (difficulty === "medium")
        newDifficulty = Math.random() > 0.3 ? "hard" : "medium";
      else if (difficulty === "easy") newDifficulty = "medium";
    } else {
      if (difficulty === "hard") newDifficulty = "medium";
      else if (difficulty === "medium") newDifficulty = "easy";
    }

    if (
      attempts.length >= 10 ||
      (streak === 0 &&
        attempts.length >= 5 &&
        attempts.filter((a) => !a.isCorrect).length >= 3)
    ) {
      setQuizCompleted(true);
      setShowResults(true);
      await finalizeTest();
      setNextQuestionLoading(false);
      return;
    }

    try {
      // Try to use real API, fallback to mock
      let response;
      try {
        response = await axios.get(
          `/api/questions?contentId=${contentId}&difficulty=${newDifficulty}&exclude=${attempts
            .map((a) => a.questionId)
            .join(",")}`
        );
      } catch (error) {
        response = await mockApiCalls.getQuestions(
          contentId,
          newDifficulty,
          attempts.map((a) => a.questionId).join(",")
        );
      }

      if (response.data && response.data.length > 0) {
        setQuestions((prev) => [...prev, ...response.data]);
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeRemaining(60);
        setDifficulty(newDifficulty);
      } else {
        setQuizCompleted(true);
        setShowResults(true);
        await finalizeTest();
      }
    } catch (error) {
      console.error("Failed to get next question:", error);
      setQuizCompleted(true);
      setShowResults(true);
      await finalizeTest();
    }
    setNextQuestionLoading(false);
  };

  const finalizeTest = async () => {
    if (!testId) return;

    try {
      // Try to use real API, fallback to mock
      try {
        await axios.patch(`/api/tests/${testId}`, {
          submittedAt: new Date().toISOString(),
        });
      } catch (error) {
        await mockApiCalls.finalizeTest(testId, {
          submittedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to finalize test:", error);
    }
  };

  const restartQuiz = () => {
    router.refresh();
  };

  const exitQuiz = () => {
    router.push(`/content/${contentId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <BrainCircuit
            size={48}
            className="text-zinc-900 dark:text-zinc-100 animate-bounce mb-4"
          />
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Loading your quiz...
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Preparing intelligent questions just for you
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = attempts.filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / attempts.length) * 100);
    const maxStreak = attempts.reduce((max, curr, i, arr: any) => {
      if (i === 0) return curr.isCorrect ? 1 : 0;
      if (!curr.isCorrect) return max;
      const streakCount = curr.isCorrect && arr[i - 1].isCorrect ? max + 1 : 1;
      return streakCount > max ? streakCount : max;
    }, 0);

    let performanceLevel = "Novice";
    if (accuracy >= 90) performanceLevel = "Expert";
    else if (accuracy >= 70) performanceLevel = "Advanced";
    else if (accuracy >= 50) performanceLevel = "Intermediate";

    return (
      <Card className="my-3 bg-white dark:bg-black w-full max-w-3xl mx-auto overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="dark:text-white text-black">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Award className="mr-2" size={28} />
            Quiz Results
          </CardTitle>
          <CardDescription className="text-zinc-300">
            You've completed the adaptive quiz!
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 bg-white dark:bg-zinc-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-black dark:text-white">
                {score}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                Total Score
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-black dark:text-white">
                {accuracy}%
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">Accuracy</div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-black dark:text-white">
                {attempts.length}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">
                Questions Attempted
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-black dark:text-white">
                {maxStreak}
              </div>
              <div className="text-zinc-500 dark:text-zinc-400">Max Streak</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Your Performance Level
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full mr-2">
                <div
                  className="bg-black dark:bg-white text-xs font-medium text-white dark:text-black text-center p-1 leading-none rounded-full"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                {performanceLevel}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Question Breakdown
            </h3>
            <div className="space-y-3">
              {attempts.map((attempt, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    attempt.isCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900"
                      : "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900"
                  }`}
                >
                  <div className="flex items-center">
                    {attempt.isCorrect ? (
                      <CheckCircle2
                        className="text-emerald-500 dark:text-emerald-400 mr-2"
                        size={20}
                      />
                    ) : (
                      <XCircle
                        className="text-rose-500 dark:text-rose-400 mr-2"
                        size={20}
                      />
                    )}
                    <span className="text-zinc-900 dark:text-zinc-100">
                      Question {index + 1}
                    </span>
                  </div>
                  {attempt.selectedOption === "timeout" ? (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900"
                    >
                      Time Expired
                    </Badge>
                  ) : (
                    <Badge
                      variant={attempt.isCorrect ? "default" : "destructive"}
                      className={
                        attempt.isCorrect
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : ""
                      }
                    >
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-zinc-200 dark:border-zinc-800 pt-6 bg-white dark:bg-zinc-950">
          <Button
            variant="outline"
            onClick={exitQuiz}
            className="border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
          >
            Exit Quiz
          </Button>
          <Button
            onClick={restartQuiz}
            className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">
            No Questions Available
          </CardTitle>
          <CardDescription className="text-zinc-500 dark:text-zinc-400">
            There are currently no questions for this content.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            onClick={exitQuiz}
            className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black"
          >
            Return to Content
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion: any = questions[currentQuestionIndex];

  return (
    <>
      {showConfetti && <Confetti />}

      <Card className="my-3 bg-white dark:bg-black w-full max-w-3xl mx-auto overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="relative  text-white">
          <div className="absolute top-3 right-3 flex space-x-3">
            <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
              <Clock size={14} className="mr-1" />
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </Badge>
            <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
              <Award size={14} className="mr-1" />
              {score}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
                    <Zap size={14} className="mr-1" />
                    {streak}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-black">
                  <p>
                    Current streak: Answer consecutive questions correctly to
                    increase difficulty!
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center mb-2">
            <CardTitle className="text-2xl font-bold dark:text-white text-black">
              Question {currentQuestionIndex + 1}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className={`ml-3 ${
                      difficulty === "easy"
                        ? "bg-emerald-500 dark:bg-emerald-600"
                        : difficulty === "medium"
                        ? "bg-amber-500 dark:bg-amber-600"
                        : "bg-rose-500 dark:bg-rose-600"
                    }`}
                  >
                    {difficulty}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-black">
                  <p>Question difficulty adapts to your performance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <CardDescription className="dark:text-zinc-300 text-zinc-900">
            Select the correct answer from the options below
          </CardDescription>

          <div className="mt-3 mb-0">
            <Progress
              value={(timeRemaining / 60) * 100}
              className="h-2"
              style={
                {
                  background: "rgba(255,255,255,0.2)",
                  "--progress-color":
                    timeRemaining < 10 ? "rgb(239 68 68)" : "rgb(255,255,255)",
                } as any
              }
            />
          </div>
        </CardHeader>

        <CardContent className="pt-6 bg-white dark:bg-zinc-950">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {currentQuestion.questionText}
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {currentQuestion.options.map((option: any, index: any) => {
                const optionLabels = ["A", "B", "C", "D"];
                const isSelected = selectedOption === option;

                const showOptionFeedback = showFeedback && isSelected;
                const isCorrectOption =
                  option === currentQuestion.correctOption;

                return (
                  <motion.div
                    key={`${currentQuestionIndex}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-start text-left p-6 h-auto transition-all ${
                        showOptionFeedback && isCorrectOption
                          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200"
                          : showOptionFeedback && !isCorrectOption
                          ? "bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-200"
                          : isSelected
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 text-zinc-900 dark:text-zinc-100"
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null || nextQuestionLoading}
                    >
                      <div className="flex items-center">
                        <span
                          className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                            isSelected
                              ? "bg-white dark:bg-black text-black dark:text-white"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {optionLabels[index]}
                        </span>
                        <span className="text-md">{option}</span>

                        {showOptionFeedback && (
                          <span className="ml-auto">
                            {isCorrectOption ? (
                              <CheckCircle2
                                size={24}
                                className="text-emerald-500 dark:text-emerald-400"
                              />
                            ) : (
                              <XCircle
                                size={24}
                                className="text-rose-500 dark:text-rose-400"
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <Button
            variant="outline"
            onClick={() => setShowExitDialog(true)}
            className="border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
          >
            Exit Quiz
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    className="bg-black hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-200 dark:text-black"
                    disabled={selectedOption === null || nextQuestionLoading}
                    onClick={() => {
                      if (selectedOption !== null && !showFeedback) {
                        setShowFeedback(false);
                        handleNextQuestion(isCorrect || false);
                      }
                    }}
                  >
                    {nextQuestionLoading ? (
                      <>Loading Next Question</>
                    ) : (
                      <>
                        Next Question
                        <ChevronRight size={18} className="ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 dark:bg-zinc-200 text-white dark:text-black">
                <p>Select an answer first</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will be saved, but you won't receive full credit for
              this quiz. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={exitQuiz}>Exit Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MCQQuiz;

export const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, index) => {
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        const delay = Math.random() * 0.5;

        return (
          <div
            key={index}
            className="absolute top-0"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 0.4,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              borderRadius: "2px",
              animation: `confetti-fall ${animationDuration}s ease-in forwards ${delay}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
