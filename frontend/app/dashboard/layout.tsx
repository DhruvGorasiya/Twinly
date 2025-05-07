import {
  SignedIn,
  UserButton,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
      <SidebarProvider defaultOpen={true}>
        <header className="absolute top-0 right-0 z-50 flex justify-end items-center p-4 gap-4 w-full">
          <div className="absolute left-4">
            <SidebarTrigger />
          </div>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity">
                Sign In / Register
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </header>
        <div className="flex h-screen pt-[64px]">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
} 