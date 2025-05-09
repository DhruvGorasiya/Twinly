"use client"

import { MessageSquare } from "lucide-react"

const chatHistory = [
  { id: '1', title: 'First Conversation', timestamp: '2h ago', preview: 'We discussed project planning and next steps...' },
  { id: '2', title: 'Travel Planning', timestamp: '5h ago', preview: 'Looking into vacation destinations and budgeting...' },
  { id: '3', title: 'Project Ideas', timestamp: 'Yesterday', preview: 'Brainstorming session for new features...' },
  { id: '4', title: 'Meeting Notes', timestamp: '2 days ago', preview: 'Summary of team sync and action items...' },
]

const ChatPage = () => {
  return (
    <main className="absolute left-64 right-0 bottom-0 top-0 bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Previous Chats</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {chatHistory.map((chat) => (
            <a
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors duration-200 group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20">
                <MessageSquare className="h-6 w-6 text-purple-400 group-hover:text-purple-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">{chat.title}</h2>
                  <span className="text-sm text-zinc-400">{chat.timestamp}</span>
                </div>
                <p className="mt-1 text-zinc-400 line-clamp-1">{chat.preview}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ChatPage;
