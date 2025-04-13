"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "~/components/AuthComponent";
import { getQuestion, updateQValue } from "~/app/api/manageQLogic";
import { generateQuestion } from "~/app/api/manageQuiz";
import { useSession } from "next-auth/react";
import { useRef, useEffect } from "react";
import MCQ from "~/components/MCQ";
import type { Attempt, Question, Topic, Test } from "@prisma/client";
import { getTopicByTest } from "~/app/api/manageTopic";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

type TestWithTopic = Prisma.TestGetPayload<{
  include: {
    topic: true;
  };
}>;

export default function Test() {
  const params = useParams();
  const testId = params.id as string;
  const [currRes, setCurrRes] = useState<Question>();
  const [nextRes, setNextRes] = useState();
  const [currSA, setCurrSA] = useState<{ state: string; action?: string }>();
  const [prevSA, setPrevSA] = useState<{ state: string; action?: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [topic, setTopic] = useState<TestWithTopic | null>();
  const { user } = useUser();
  const { status } = useSession();
  const hasRun = useRef(false);
  const questionNo = useRef(0);
  const [attempts, setAttempts] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (hasRun.current) return;
    if (status === "authenticated" && user) {
      hasRun.current = true;
      startGame();
    }
  }, [user, status]);

  const startGame = async () => {
    if (user) {
      const currTopic = await getTopicByTest(testId);
      setTopic(currTopic);
      const currQuestion = await getQuestion(user.id, currTopic?.topic.id!);
      setCurrSA(currQuestion);
      const oaiRes = await generateQuestion(
        currQuestion.state,
        currTopic?.topic.id!
      );
      if (oaiRes) {
        setCurrRes(oaiRes);
        console.log(oaiRes);
        setIsLoading(false);
      }
    }
  };

  const handleEndQuiz = async () => {
    await axios.post("http://3.109.48.9:8000/upload_attempts", {
      attempts: attempts,
    });

    router.push(`/topic/${topic?.topic.id}`);
  };

  const processSubmission = async (attempt: Attempt) => {
    console.log(prevSA);
    console.log(currSA);
    if (user) {
      setIsLoading(true);
      setAttempts((prev) => [
        ...prev,
        `${user.name} gave a ${
          attempt.isCorrect ? "correct" : "incorrect"
        } answer for question ${currRes?.questionText} of the topic ${
          currSA?.state!
        } by answering ${attempt.selectedOption} and took ${
          attempt.timeTaken
        } secs to answer`,
      ]);
      if (questionNo.current >= 1) {
        await updateQValue(
          user?.id,
          topic?.id!,
          prevSA?.state!,
          currSA?.action!,
          currSA?.state!,
          attempt.isCorrect,
          attempt.timeTaken
        );
      }

      const currQuestion = await getQuestion(
        user?.id,
        topic?.topic.id!,
        currSA?.state!,
        currSA?.action
      );

      console.log(currQuestion);

      setPrevSA(currSA);
      setCurrSA(currQuestion);
      const oaiRes = await generateQuestion(
        currQuestion.state,
        topic?.topic.id!
      );
      if (oaiRes) {
        // setNextRes(oaiRes);
        console.log(oaiRes);
        setCurrRes(oaiRes);
      }
      questionNo.current += 1;
      setIsLoading(false);
    }
  };

  if (!currRes || isLoading) {
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
    <div>
      {
        <MCQ
          data={currRes!}
          topic={currSA?.state.split("-")[0]!}
          testId={testId}
          processSubmission={processSubmission}
          handleEndQuiz={handleEndQuiz}
        />
      }
    </div>
  );
}
