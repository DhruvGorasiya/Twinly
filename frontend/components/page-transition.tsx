"use client";

import { motion } from "framer-motion";

export function PageTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Main transition element */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo animation */}
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 blur-xl" />
          <div className="relative text-6xl font-bold text-white">T</div>
        </motion.div>
      </motion.div>

      {/* Slide overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/90 to-black"
        initial={{ y: "100%" }}
        animate={{ y: ["100%", "0%", "0%", "-100%"] }}
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.4, 0.6, 1],
        }}
      />
    </motion.div>
  );
}
