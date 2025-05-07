'use client'

import React, { useState } from "react";

const DashboardPage = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    // Placeholder for AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "(AI response will appear here)" },
      ]);
    }, 1000);
  };

  return (
    <main className="absolute left-64 right-0 bottom-0 top-0 bg-black overflow-hidden">
      <div className="w-full max-w-5xl mx-auto h-full flex flex-col">
        {/* Messages container */}
        <div className="flex-1 overflow-auto">
          <div className="w-full space-y-4 p-6">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-[70%] text-base ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-gray-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input form */}
        <div className="border-t border-zinc-800 p-4 bg-black">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder-gray-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage; 