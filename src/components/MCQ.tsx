"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Award, CheckCircle2, ChevronRight, XCircle, Zap } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
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
import type { Attempt, Question } from "@prisma/client";
import { submitAnswer } from "~/app/api/manageQuiz";
import { useRouter } from "next/navigation";

const MCQ = ({
  data,
  topic,
  testId,
  processSubmission,
}: {
  data: Question;
  topic: string;
  testId: string;
  processSubmission: (attempt: Attempt) => Promise<void>;
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [nextQuestionLoading, setNextQuestionLoading] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [time, setTime] = useState(0);
  const [isDone, setIsDone] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDone) {
        setTime((prevTime) => prevTime + 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, isDone]);

  const handleOptionSelect = async (option: string) => {
    if (selectedOption !== null || nextQuestionLoading) return;

    const correct = option === data.correctOption;
    setIsCorrect(correct);
    setSelectedOption(option);

    if (correct) {
      // setScore((prev) => prev + 100 + Math.floor(timeRemaining * 1.5));
      // setStreak((prev) => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }

    setShowFeedback(true);

    // setTimeout(() => {
    //   setShowFeedback(false);
    // }, 2000);
  };

  const handleNextQuestion = async () => {
    setTime(0);
    setSelectedOption(null);
    setIsDone(false);
    setIsCorrect(false);
    setShowFeedback(false);

    const attempt = await submitAnswer({
      testId: testId,
      isCorrect: isCorrect,
      timeTaken: time,
      qid: data.id,
      answer: selectedOption!,
    });

    await processSubmission(attempt);
  };

  return (
    <div>
      <Card className="my-3 bg-white dark:bg-black w-full max-w-3xl mx-auto overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
        <CardHeader className="relative  text-white">
          <div className="absolute top-3 right-3 flex space-x-3">
            {/* <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
              <Clock size={14} className="mr-1" />
              {Math.floor(timeRemaining / 60)}:
              {(timeRemaining % 60).toString().padStart(2, "0")}
            </Badge> */}
            <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
              <Award size={14} className="mr-1" />
              {/* {score} */}10
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="border-zinc-300 dark:border-zinc-700 text-zinc-100 dark:text-zinc-900 transition-colors">
                    <Zap size={14} className="mr-1" />
                    {/* {streak} */}2
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
              {/* Question {currentQuestionIndex + 1} */}Question No
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    className="ml-3"
                    // className={`ml-3 ${
                    //   difficulty === "easy"
                    //     ? "bg-emerald-500 dark:bg-emerald-600"
                    //     : difficulty === "medium"
                    //     ? "bg-amber-500 dark:bg-amber-600"
                    //     : "bg-rose-500 dark:bg-rose-600"
                    // }`}
                  >
                    {/* {difficulty} */} {topic}
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
              value={(20 / 60) * 100}
              className="h-2"
              style={
                {
                  background: "rgba(255,255,255,0.2)",
                  "--progress-color":
                    20 < 10 ? "rgb(239 68 68)" : "rgb(255,255,255)",
                } as any
              }
            />
          </div>
        </CardHeader>

        <CardContent className="pt-6 bg-white dark:bg-zinc-950">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              {data.questionText}
            </h3>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {data.options?.split("-").map((option: any, index: any) => {
                const optionLabels = ["A", "B", "C", "D"];
                const isSelected = selectedOption === option;
                const isCorrectOption = option === data.correctOption;
                const showOptionFeedback = showFeedback && isSelected;

                return (
                  <motion.div
                    key={`${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className={`w-full justify-start text-left p-6 h-auto transition-all ${
                        showFeedback && isCorrectOption
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

                        {showFeedback && (
                          <span className="ml-auto">
                            {isCorrectOption ? (
                              <CheckCircle2
                                size={24}
                                className="text-emerald-500 ml-3 dark:text-emerald-400"
                              />
                            ) : showOptionFeedback ? (
                              <XCircle
                                size={24}
                                className="text-rose-500 ml-3 dark:text-rose-400"
                              />
                            ) : (
                              <></>
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
                    onClick={handleNextQuestion}
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
            <AlertDialogAction
            onClick={() => router.push("/classrooms")}
            >
              Exit Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MCQ;
