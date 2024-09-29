'use client'

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import ShimmerButton from "@/components/ui/shimmer-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const ShimmerButtonDemo: React.FC<{ text: string; href: string }> = ({ text, href }) => {
  return (
    <Link href={href} className="z-10 inline-block">
      <ShimmerButton className="shadow-xl">
        <span className="flex items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
          {text}
          <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
        </span>
      </ShimmerButton>
    </Link>
  );
};

export function ShuffleHeroSection() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="w-full max-w-[1663px] mx-auto flex items-center justify-center pt-4 sm:pt-6 md:pt-8">
      <motion.div 
        className="bg-[rgb(245,245,247)] rounded-3xl p-4 sm:p-6 lg:p-8 w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col lg:flex-row">
          <motion.div className="lg:w-1/2 flex flex-col mb-6 lg:mb-0" variants={itemVariants}>
            <div className="mb-2 flex items-center">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
               Meget mere overblik
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <Info className="w-4 h-4" />
                      <span className="sr-only">Information om hvor meget mere overblik man får ved brug af Lingvist.</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <p className="text-sm text-wrap">
                      Når du uploader dine dokumenter til Lingvist, gør du dem til den primære informationskilde for AI. Det gør ganske enkelt, at du slipper for at bekymre dig om sandhedsgraden af de svar du får. De er nemlig baseret på dine dokumenter.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="mb-4 lg:mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950">
                Få AI til at finde det du søger i dine dokumenter.
              </h2>
              <p className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block">
                Udnyt op til 500 sider samtidigt.
              </p>
            </div>
            <p className="text-sm sm:text-base xl:text-lg text-slate-950 dark:text-slate-300 mb-4">
              Lav en pålidelig AI-assistent baseret på dine dokumenter, som citerer kilderne i sine svar.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-slate-700">Pålidelige svar baseret på dine dokumenter</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-slate-700">Kildehenvisninger i alle svar</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm text-slate-700">AI-dreven notatskrivning</span>
              </div>
            </div>
            <div className="mt-2">
              <ShimmerButtonDemo text="Upload nu" href="/dashboard" />
            </div>
          </motion.div>
          <motion.div className="lg:w-1/2 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]" variants={itemVariants}>
            <ShuffleGrid />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
const shuffle = (array: (typeof squareData)[0][]) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const squareData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1565728744382-61accd4aa148?q=80&w=3873&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1501503069356-3c6b82a17d89?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1541960071727-c531398e7494?q=80&w=2448&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1571075002844-e5180c614639?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1616587896595-51352538155b?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1615914143778-1a1a6e50c5dd?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 8,
    src: "https://plus.unsplash.com/premium_photo-1699792104161-918ea0897b5a?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 9,
    src: "https://plus.unsplash.com/premium_photo-1707155466079-1e26948df28c?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 10,
    src: "https://plus.unsplash.com/premium_photo-1661281350976-59b9514e5364?q=80&w=3869&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1498758536662-35b82cd15e29?q=80&w=3776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=3876&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1682669328101-3a0f8a12d06d?q=80&w=3871&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1677078611286-4d023c913878?q=80&w=3876&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 16,
    src: "https://plus.unsplash.com/premium_photo-1723867258962-caedc0da9ff4?q=80&w=3798&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const generateSquares = () => {
  return shuffle(squareData).map((sq, index) => {
    const isTopLeft = index === 0;
    const isTopRight = index === 3;
    const isBottomLeft = index === 12;
    const isBottomRight = index === 15;

    const cornerClasses = 
      (isTopLeft ? "rounded-tl-3xl" : "") +
      (isTopRight ? "rounded-tr-3xl" : "") +
      (isBottomLeft ? "rounded-bl-3xl" : "") +
      (isBottomRight ? "rounded-br-3xl" : "");

    return (
      <motion.div
        key={sq.id}
        layout
        transition={{ duration: 1.5, type: "spring" }}
        className={`w-full h-full relative ${cornerClasses}`}
      >
        <Image
          src={sq.src}
          alt={`Image ${sq.id}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover ${cornerClasses}`}
        />
      </motion.div>
    );
  });
};

const ShuffleGrid = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [squares, setSquares] = useState(generateSquares());

  const shuffleSquares = useCallback(() => {
    setSquares(generateSquares());
    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  }, []);

  useEffect(() => {
    shuffleSquares();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [shuffleSquares]);

  return (
    <div className="grid grid-cols-4 grid-rows-4 h-full gap-1 rounded-3xl overflow-hidden">
      {squares.map((sq) => sq)}
    </div>
  );
};

export default ShuffleHeroSection;