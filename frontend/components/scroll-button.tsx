'use client';

import { ArrowRight } from "lucide-react";

interface ScrollButtonProps {
  targetId: string;
  variant: 'light' | 'dark';
}

export function ScrollButton({ targetId, variant }: ScrollButtonProps) {
  const scrollToNextSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      onClick={() => scrollToNextSection(targetId)}
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-colors duration-200 animate-bounce ${
        variant === 'light' 
          ? 'text-gray-600 hover:text-gray-800' 
          : 'text-white/80 hover:text-white'
      }`}
      aria-label={`Scroll to ${targetId}`}
    >
      <ArrowRight className="h-8 w-8 rotate-90" />
    </button>
  );
} 