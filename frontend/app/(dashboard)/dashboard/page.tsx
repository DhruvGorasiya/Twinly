"use client";

import React, { useState, useRef, useEffect } from "react";

const DashboardPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey I am Twinly, your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsWaitingForResponse(true);

    try {
      // Make API call to backend
      const response = await fetch(`${BACKEND_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://twinly.net",
        },
        credentials: "include",
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from AI");
      }

      // Add an empty assistant message that we'll update with streaming content
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsWaitingForResponse(false);
      setIsLoading(true);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              accumulatedContent += data.content;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content = accumulatedContent;
                return newMessages;
              });
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setIsWaitingForResponse(false);
    }
  };

  return (
    <main className="absolute left-64 right-0 bottom-0 top-0 bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-auto">
          <div className="w-full space-y-4 p-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] text-base ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      : "bg-zinc-800 text-gray-100"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <div
                      className="prose prose-invert max-w-none
                        prose-headings:text-white 
                        prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4
                        prose-h2:text-xl prose-h2:font-semibold prose-h2:mb-3
                        prose-p:text-gray-300 prose-p:mb-4
                        prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-4
                        prose-li:text-gray-300 prose-li:mb-2
                        prose-strong:text-white prose-strong:font-bold
                        prose-em:text-gray-300 prose-em:italic
                        prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic
                        prose-hr:border-gray-700 prose-hr:my-4
                        prose-pre:bg-zinc-900 prose-pre:p-4 prose-pre:rounded-lg
                        prose-code:text-gray-300
                        [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4
                        [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-3
                        [&>p]:text-gray-300 [&>p]:mb-4
                        [&>ul]:text-gray-300 [&>ul]:list-disc [&>ul]:pl-4
                        [&>li]:text-gray-300 [&>li]:mb-2
                        [&>strong]:text-white [&>strong]:font-bold
                        [&>em]:text-gray-300 [&>em]:italic
                        [&>blockquote]:text-gray-400 [&>blockquote]:border-l-4 [&>blockquote]:border-gray-600 [&>blockquote]:pl-4 [&>blockquote]:italic
                        [&>hr]:border-gray-700 [&>hr]:my-4
                        [&>pre]:bg-zinc-900 [&>pre]:p-4 [&>pre]:rounded-lg
                        [&>code]:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  )}
                  {isLoading &&
                    idx === messages.length - 1 &&
                    msg.role === "assistant" && (
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                    )}
                </div>
              </div>
            ))}
            {/* Show loading animation while waiting for initial response */}
            {isWaitingForResponse && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-lg max-w-[70%] text-base bg-zinc-800 text-gray-100">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form */}
        <div className="border-t border-white/5 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-white/5 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 ease-out ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
