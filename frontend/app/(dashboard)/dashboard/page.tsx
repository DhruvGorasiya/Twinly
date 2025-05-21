"use client";

import React, { useState } from "react";

const DashboardPage = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the chat
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);

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

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = ""; // Track accumulated content

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              accumulatedContent += data.content; // Accumulate the content
              // Update the last message with the accumulated content
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                lastMessage.content = accumulatedContent; // Use accumulated content
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
      // Add error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
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
                  {msg.content}
                  {isLoading &&
                    idx === messages.length - 1 &&
                    msg.role === "assistant" && (
                      <span className="inline-block w-2 h-4 ml-1 bg-gray-400 animate-pulse" />
                    )}
                </div>
              </div>
            ))}
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
