"use client";
import { TextInput } from "@tremor/react";
import { Send, User2, MessageCircleIcon, X } from "lucide-react";
import React, { useState } from "react";
import type { Message } from "ai/react";
import { useChat } from "ai/react";
import { Bot, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  const [openChat, setOpenChat] = useState(false);
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!myRef?.current?.contains(event.target)) {
        setOpenChat(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [myRef]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); // /api/chat

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (openChat && screen.width > 850) {
      inputRef.current?.focus();
    }
  }, [openChat]);

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";
  return (
    <div ref={myRef}>
      <button
        onClick={() => setOpenChat(!openChat)}
        className="fixed md:bottom-4 bottom-16 right-4 z-40"
      >
        <div className="bg-gray-900 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 text-gray-50 rounded-full p-3 shadow-lg cursor-pointer hover:bg-gray-800 transition-colors">
          {openChat ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircleIcon className="w-6 h-6" />
          )}
        </div>
      </button>
      {openChat ? (
        <div className="fixed md:bottom-20 bottom-28 z-40 right-4 w-[400px] max-w-[90%] bg-white shadow-2xl rounded-2xl dark:bg-gray-900">
          <header className="flex items-center px-4 py-3 bg-white dark:border-b border-gray-500 shadow rounded-t-2xl dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <Bot className="w-9 h-9 p-1.5 dark:text-white text-black" />
              <div className="text-md dark:text-white text-black font-medium">
                Chatbot
              </div>
            </div>
          </header>
          <div
            className="flex-1 h-[400px] overflow-y-auto p-4 space-y-4"
            ref={scrollRef}
          >
            {messages.map((message: any) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && lastMessageIsUser && (
              <ChatMessage
                message={{
                  id: "loading",
                  role: "assistant",
                  content: "Thinking...",
                }}
              />
            )}
            {error && (
              <ChatMessage
                message={{
                  id: "error",
                  role: "assistant",
                  content: "An error occurred. Please try again.",
                }}
              />
            )}
            {!error && messages.length === 0 && (
              <div className="dark:text-white text-black mx-8 flex h-full flex-col items-center justify-center gap-3 text-center">
                <Bot size={28} />
                <p>Chatbot</p>
                <p>
                  Ask me any question and I will try to help you out!
                </p>
                <p className="text-sm text-muted-foreground">
                  Type your message below!
                </p>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-4 flex items-center gap-2 shadow rounded-b-2xl dark:bg-gray-900"
          >
            <button
              type="button"
              className="dark:text-white text-black flex w-10 flex-none items-center justify-center"
              title="Clear chat"
              onClick={() => setMessages([])}
            >
              <Trash size={24} />
            </button>
            <TextInput
              value={input}
              onChange={handleInputChange}
              className="flex-1 px-4 rounded-xl bg-gray-100 dark:bg-gray-800"
              placeholder="Type your message..."
              ref={inputRef}
            />
            <button
              type="submit"
              disabled={input.length === 0}
              title="Submit message"
            >
              <Send className="dark:text-white text-black h-5 w-5" />
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

interface ChatMessageProps {
  message: Message;
}

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  const isAiMessage = role === "assistant";
  return (
    <>
      {isAiMessage ? (
        <div className="flex items-start gap-3 ">
          <Bot className="w-9 h-9 p-1.5 rounded-full dark:text-white text-black" />
          <div className="text-black rounded-2xl p-3 max-w-[70%] shadow dark:bg-gray-800 dark:text-gray-200 break-words">
            <ReactMarkdown
              components={{
                a: ({ node, ref, ...props }) => (
                  <Link
                    {...props}
                    href={props.href ?? ""}
                    target="_blank"
                    className="text-primary underline"
                  />
                ),
                p: ({ node, ref, ...props }) => {
                  return <p {...props} className="mt-3 first:mt-0" />;
                },
                ul: ({ ref, ...props }) => {
                  return (
                    <ul
                      {...props}
                      className="mt-3 list-inside list-disc first:mt-0"
                    />
                  );
                },
                li: ({ node, ref, ...props }) => {
                  return <li {...props} className="mt-1" />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 justify-end">
          <div className="dark:bg-green-700 bg-green-600 rounded-2xl p-3 max-w-[70%] text-white shadow break-words">
            <ReactMarkdown
              components={{
                a: ({ node, ref, ...props }) => (
                  <Link
                    {...props}
                    href={props.href ?? ""}
                    target="_blank"
                    className="text-primary underline"
                  />
                ),
                p: ({ node, ref, ...props }) => {
                  return <p {...props} className="mt-3 first:mt-0" />;
                },
                ul: ({ ref, ...props }) => {
                  return (
                    <ul
                      {...props}
                      className="mt-3 list-inside list-disc first:mt-0"
                    />
                  );
                },
                li: ({ node, ref, ...props }) => {
                  return <li {...props} className="mt-1" />;
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          <User2 className="w-9 h-9 p-1.5 rounded-full dark:text-white text-black" />
        </div>
      )}
    </>
  );
}

export default Chatbot;
