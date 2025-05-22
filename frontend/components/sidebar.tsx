"use client"

import { Home, MessageSquare, CheckSquare, Brain, Plug, Settings, Plus } from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import dashboardLogo from '@/app/assets/twinly-logo.png'
import Link from "next/link"

// Temporary chat history data - this would come from your backend later
const chatHistory = [
  { id: '1', title: 'First Conversation', timestamp: '2h ago' },
  { id: '2', title: 'Travel Planning', timestamp: '5h ago' },
  { id: '3', title: 'Project Ideas', timestamp: 'Yesterday' },
]

const navigationItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Previous Chats", href: "/chat", icon: MessageSquare },
  { name: "New Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Memory", href: "/memory", icon: Brain },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  return (
    <ShadcnSidebar className="border-r border-white/5 bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900 flex flex-col">
      <SidebarHeader className="py-5">
        <Link
          href="/"
          className="flex items-center px-5 group h-16 cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          <div className="flex h-16 w-16 items-center justify-center">
            <Image
              src={dashboardLogo}
              alt="Twinly Logo"
              width={64}
              height={64}
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-lg"
              priority
            />
          </div>
          <span className="ml-3 text-xl font-semibold text-white group-hover:underline">
            Twinly
          </span>
        </Link>
        <div className="px-5 mt-5">
          <Button
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-medium flex items-center justify-center gap-2 rounded-xl h-12 shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-purple-500/30 hover:scale-[1.02]"
            variant="default"
          >
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 flex-1">
        {/* Chat History Section */}
        <div className="px-2 py-2">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 ml-1">
            Recent Chats
          </h2>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <a
                key={chat.id}
                href={`/dashboard/chat/${chat.id}`}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-500/10 cursor-pointer transition-all duration-200 group hover:shadow-lg"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-200">
                  <MessageSquare className="h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                </div>
                <p className="text-white/90 group-hover:text-white transition-colors duration-200">
                  {chat.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </SidebarContent>

      {/* Navigation Section moved to footer */}
      <SidebarFooter className="px-3 py-4 mt-auto">
        <h2 className="px-2 text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4 ml-1">
          Navigation
        </h2>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
              >
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center text-zinc-400 hover:text-purple-200 hover:bg-purple-500/10 rounded-xl px-3 py-2.5 transition-all duration-200"
                  )}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="ml-3 font-medium">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
