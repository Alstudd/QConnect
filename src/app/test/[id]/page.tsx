"use client";
import React from "react";
import { useParams } from "next/navigation";
import MCQQuiz from "~/components/MCQQuiz";

export default function Test() {
  const params = useParams();
  const testId = params.id as string;

  return <div>page</div>;
}
