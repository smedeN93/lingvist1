import React, { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
  infinite = false,
}: {
  words: string[];
  className?: string;
  cursorClassName?: string;
  infinite?: boolean;
}) => {
  const controls = useAnimationControls();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const animateWords = async () => {
      try {
        await controls.start({
          width: "100%",
          transition: { duration: 2, ease: "easeInOut" }
        });
        
        if (index === words.length - 1 && !infinite) {
          // If it's the last word and not infinite, don't animate out
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await controls.start({
          width: "0%",
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        
        setIndex((prev) => (infinite ? (prev + 1) % words.length : Math.min(prev + 1, words.length - 1)));
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    animateWords();
  }, [index, words, controls, mounted, infinite]);

  if (!mounted) return null;

  return (
    <div className={cn("flex items-center", className)}>
      <motion.div
        className="overflow-hidden whitespace-nowrap relative"
        initial={{ width: "0%" }}
        animate={controls}
      >
        <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block lg:py-1">
          {words[index]}
        </div>
      </motion.div>
    </div>
  );
};