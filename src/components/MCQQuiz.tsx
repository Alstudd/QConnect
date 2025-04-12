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
  CardTitle 
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
  HelpCircle
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

const MCQQuiz: React.FC<QuizProps> = ({ contentId, testId }) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState<Array<{questionId: string, selectedOption: string, isCorrect: boolean}>>([]);
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
  }, [loading, quizCompleted, showResults, selectedOption, currentQuestionIndex]);
  
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const existingTest = testId 
          ? await axios.get(`/api/tests/${testId}`)
          : await axios.post('/api/tests', { contentId });
        
        const currentTestId = testId || existingTest.data.id;
        
        const response = await axios.get(`/api/questions?contentId=${contentId}&difficulty=${difficulty}`);
        setQuestions(response.data);
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
      setScore(prev => prev + 100 + Math.floor(timeRemaining * 1.5));
      setStreak(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setStreak(0);
    }
    
    const newAttempt = {
      questionId: currentQuestion.id,
      selectedOption: option,
      isCorrect: correct
    };
    
    setAttempts(prev => [...prev, newAttempt]);
    
    try {
      await axios.post('/api/attempts', {
        testId: testId,
        questionId: currentQuestion.id,
        selectedOption: option,
        isCorrect: correct
      });
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
      isCorrect: false
    };
    
    setAttempts(prev => [...prev, newAttempt]);
    setStreak(0);
    
    try {
      await axios.post('/api/attempts', {
        testId: testId,
        questionId: currentQuestion.id,
        selectedOption: "timeout",
        isCorrect: false
      });
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
      if (difficulty === "medium") newDifficulty = Math.random() > 0.3 ? "hard" : "medium";
      else if (difficulty === "easy") newDifficulty = "medium";
    } else {
      if (difficulty === "hard") newDifficulty = "medium";
      else if (difficulty === "medium") newDifficulty = "easy";
    }
    
    if (attempts.length >= 10 || (streak === 0 && attempts.length >= 5 && attempts.filter(a => !a.isCorrect).length >= 3)) {
      setQuizCompleted(true);
      setShowResults(true);
      await finalizeTest();
      setNextQuestionLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`/api/questions?contentId=${contentId}&difficulty=${newDifficulty}&exclude=${attempts.map(a => a.questionId).join(',')}`);
      
      if (response.data && response.data.length > 0) {
        setQuestions(prev => [...prev, ...response.data]);
        setCurrentQuestionIndex(prev => prev + 1);
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
      await axios.patch(`/api/tests/${testId}`, {
        submittedAt: new Date().toISOString()
      });
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
          <BrainCircuit size={48} className="text-indigo-500 animate-bounce mb-4" />
          <h3 className="text-xl font-bold text-slate-700">Loading your quiz...</h3>
          <p className="text-slate-500 mt-2">Preparing intelligent questions just for you</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = attempts.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctAnswers / attempts.length) * 100);
    const maxStreak = attempts.reduce((max, curr, i, arr: any) => {
      if (i === 0) return curr.isCorrect ? 1 : 0;
      if (!curr.isCorrect) return max;
      const streakCount = curr.isCorrect && arr[i-1].isCorrect ? max + 1 : 1;
      return streakCount > max ? streakCount : max;
    }, 0);
    
    let performanceLevel = "Novice";
    if (accuracy >= 90) performanceLevel = "Expert";
    else if (accuracy >= 70) performanceLevel = "Advanced";
    else if (accuracy >= 50) performanceLevel = "Intermediate";
    
    return (
      <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Award className="mr-2" size={28} />
            Quiz Results
          </CardTitle>
          <CardDescription className="text-indigo-100">
            You've completed the adaptive quiz!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">{score}</div>
              <div className="text-slate-500">Total Score</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">{accuracy}%</div>
              <div className="text-slate-500">Accuracy</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">{attempts.length}</div>
              <div className="text-slate-500">Questions Attempted</div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">{maxStreak}</div>
              <div className="text-slate-500">Max Streak</div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Your Performance Level</h3>
            <div className="flex items-center">
              <div className="w-full bg-slate-200 rounded-full mr-2">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full"
                  style={{ width: `${accuracy}%` }}
                ></div>
              </div>
              <span className="text-slate-700 font-medium">{performanceLevel}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Question Breakdown</h3>
            <div className="space-y-3">
              {attempts.map((attempt, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    attempt.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center">
                    {attempt.isCorrect ? (
                      <CheckCircle2 className="text-green-500 mr-2" size={20} />
                    ) : (
                      <XCircle className="text-red-500 mr-2" size={20} />
                    )}
                    <span className="text-slate-700">Question {index + 1}</span>
                  </div>
                  {attempt.selectedOption === "timeout" ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      Time Expired
                    </Badge>
                  ) : (
                    <Badge variant={attempt.isCorrect ? "default" : "destructive"}>
                      {attempt.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={exitQuiz}>
            Exit Quiz
          </Button>
          <Button onClick={restartQuiz} className="bg-gradient-to-r from-indigo-500 to-purple-600">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>No Questions Available</CardTitle>
          <CardDescription>There are currently no questions for this content.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={exitQuiz}>Return to Content</Button>
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion: any = questions[currentQuestionIndex];
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <Card className="w-full max-w-3xl mx-auto overflow-hidden shadow-lg">
        <CardHeader className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="absolute top-3 right-3 flex space-x-3">
            <Badge className="bg-white/20 hover:bg-white/30 transition-colors">
              <Clock size={14} className="mr-1" />
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </Badge>
            <Badge className="bg-white/20 hover:bg-white/30 transition-colors">
              <Award size={14} className="mr-1" />
              {score}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-white/20 hover:bg-white/30 transition-colors">
                    <Zap size={14} className="mr-1" />
                    {streak}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Current streak: Answer consecutive questions correctly to increase difficulty!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center mb-2">
            <CardTitle className="text-2xl font-bold">Question {currentQuestionIndex + 1}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge 
                    className={`ml-3 ${
                      difficulty === 'easy' ? 'bg-green-500' : 
                      difficulty === 'medium' ? 'bg-amber-500' : 
                      'bg-red-500'
                    }`}
                  >
                    {difficulty}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Question difficulty adapts to your performance</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <CardDescription className="text-indigo-100">
            Select the correct answer from the options below
          </CardDescription>
          
          <div className="mt-3 mb-0">
            <Progress value={timeRemaining / 60 * 100} className="h-2" 
              style={{
                background: 'rgba(255,255,255,0.3)',
                '--progress-color': timeRemaining < 10 ? 'rgb(239 68 68)' : 'rgb(255,255,255)',
              } as any}
            />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {currentQuestion.questionText}
            </h3>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {currentQuestion.options.map((option: any, index: any) => {
                const optionLabels = ['A', 'B', 'C', 'D'];
                const isSelected = selectedOption === option;
                
                const showOptionFeedback = showFeedback && isSelected;
                const isCorrectOption = option === currentQuestion.correctOption;
                
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
                        showOptionFeedback && isCorrectOption ? "bg-green-100 border-green-500 text-green-900" :
                        showOptionFeedback && !isCorrectOption ? "bg-red-100 border-red-500 text-red-900" :
                        isSelected ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white" : 
                        "hover:border-indigo-300 hover:bg-indigo-50"
                      }`}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null || nextQuestionLoading}
                    >
                      <div className="flex items-center">
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                          isSelected ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {optionLabels[index]}
                        </span>
                        <span className="text-md">{option}</span>
                        
                        {showOptionFeedback && (
                          <span className="ml-auto">
                            {isCorrectOption ? (
                              <CheckCircle2 size={24} className="text-green-600" />
                            ) : (
                              <XCircle size={24} className="text-red-600" />
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
        
        <CardFooter className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => setShowExitDialog(true)}
          >
            Exit Quiz
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
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
              <TooltipContent>
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
              Your progress will be saved, but you won't receive full credit for this quiz. Are you sure you want to exit?
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
              borderRadius: '2px',
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