"use client"

import { Home, MessageSquare, CheckSquare, Brain, Link, Settings } from "lucide-react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Memory", href: "/memory", icon: Brain },
  { name: "Integrations", href: "/integrations", icon: Link },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  return (
    <ShadcnSidebar className="border-r border-gray-200">
      <SidebarHeader className="py-4">
        <div className="flex items-center px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <span className="ml-2 text-xl font-semibold">Twinly</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.href} className={cn("flex items-center", item.name === "Home" && "bg-gray-100")}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  )
}
