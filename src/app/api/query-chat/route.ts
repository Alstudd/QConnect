import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { messages } = body;

    // Get the latest user message
    const latestUserMessage = messages.filter(
      (message: any) => message.role === "user"
    ).pop();

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "No user message found" },
        { status: 400 }
      );
    }

    // Extract the query from the latest user message
    const query = latestUserMessage.content;

    // Make the request to the external API
    const response = await axios.post("https://qconnect-py-server.onrender.com/query_attempts", {
      query: query,
    });

    // Format the response data to ensure it's a string
    let formattedContent = "";

    // Check if we received data
    if (response.data) {
      // If the response is an object or array, convert it to a string representation
      if (typeof response.data === 'object') {
        try {
          // Convert complex data to formatted string
          formattedContent = JSON.stringify(response.data, null, 2);
        } catch (e) {
          formattedContent = "Received data in an unsupported format";
        }
      } else {
        // If it's already a string, use it directly
        formattedContent = String(response.data);
      }
    } else {
      formattedContent = "No data received from the server";
    }

    // Return the formatted response
    return NextResponse.json({
      content: formattedContent,
      role: "assistant",
    });
  } catch (error) {
    console.error("Error in query-chat API:", error);
    
    // Return an appropriate error response
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}