// Example: (dashboard)/memory/page.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const TasksPage = () => {
  return (
    <main className="absolute left-64 right-0 bottom-0 top-0 bg-gradient-to-b from-zinc-900 via-[#0f0f12] to-zinc-900 overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <Sparkles className="h-16 w-16 text-purple-400 animate-bounce mb-6" />
        <h1 className="text-4xl font-bold mb-4 text-white">
          Feature Coming Soon!
        </h1>
        <p className="text-lg text-zinc-200 mb-2 text-center">
          We&apos;re working hard to bring this feature to you.
        </p>
        <p className="text-md text-zinc-400 text-center">
          Stay tuned for updates!
        </p>
      </motion.div>
    </main>
  );
};

export default TasksPage;
