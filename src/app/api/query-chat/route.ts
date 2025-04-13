import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    const latestUserMessage = messages.filter(
      (message: any) => message.role === "user"
    ).pop();

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }

    const query = latestUserMessage.content;

    const response = await axios.post("http://3.109.48.9:8000/query_attempts", {
      query: query,
    });

    return NextResponse.json({
      content: response.data,
      role: "assistant",
    });
  } catch (error) {
    console.error("Error in query-chat API:", error);
    
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}