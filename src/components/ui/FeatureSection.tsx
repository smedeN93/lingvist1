'use client'

import React, { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Info, CheckCircle2, Zap, Filter, Quote } from 'lucide-react'
import ShimmerButton from "@/components/ui/shimmer-button"
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
  )
}

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
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

const squareData = [
  {
    id: 1,
    src: "/asdf (10).png",
    title: "AI-dreven notatskrivning",
    icon: Zap,
  },
  {
    id: 2,
    src: "/33333.png",
    title: "Tematisk filtrering",
    icon: Filter,
  },
  {
    id: 3,
    src: "/fdsa.png",
    title: "Præcis citering",
    icon: Quote,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1688025950970-2ffb840b8f64?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "",
    icon: null,
  },
]

const shuffle = (array: typeof squareData) => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

const generateSquares = () => {
  return shuffle([...squareData]).map((sq, index) => {
    const isTopLeft = index === 0
    const isTopRight = index === 1
    const isBottomLeft = index === 2
    const isBottomRight = index === 3

    const cornerClasses = 
      (isTopLeft ? "rounded-tl-3xl" : "") +
      (isTopRight ? "rounded-tr-3xl" : "") +
      (isBottomLeft ? "rounded-bl-3xl" : "") +
      (isBottomRight ? "rounded-br-3xl" : "")

    return (
      <motion.div
        key={sq.id}
        layout
        transition={{ duration: 1.5, type: "spring" }}
        className={`w-full h-full relative ${cornerClasses} overflow-hidden`}
      >
        <Image
          src={sq.src}
          alt={sq.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover ${cornerClasses}`}
          priority={index === 0} // Load the first image with priority
        />
        <div className="absolute inset-0 bg-black/30" /> {/* Slight dark overlay */}
        {sq.title && sq.icon && (
          <div className="absolute bottom-4 left-4 max-w-[80%]">
            <div className="bg-white/50 backdrop-blur-lg rounded-lg p-2 sm:p-3 inline-block">
              <div className="flex items-center">
                <div className="bg-slate-800 rounded-full p-1 sm:p-1.5 mr-2 sm:mr-3">
                  <sq.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <h3 className="text-slate-900 text-xs sm:text-sm font-semibold">{sq.title}</h3>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    )
  })
}

const ShuffleGrid = () => {
  const [squares, setSquares] = useState<React.ReactNode[]>([])

  const shuffleSquares = useCallback(() => {
    setSquares(generateSquares())
  }, [])

  useEffect(() => {
    // Initial generation of squares on the client side
    setSquares(generateSquares())

    const intervalId = setInterval(shuffleSquares, 3000)
    return () => clearInterval(intervalId)
  }, [shuffleSquares])

  // Render a loading state or empty div for initial server-side render
  if (squares.length === 0) {
    return <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 rounded-3xl overflow-hidden"></div>
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 h-full gap-1 rounded-3xl overflow-hidden">
      {squares}
    </div>
  )
}

export default function ImageShuffleCard() {
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
                Hyppigt nye features
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950 tracking-[-0.04em]">
                AI til søgning med citeringer og notatskrivning.
              </h2>
              <p className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block tracking-[-0.04em]">
                Alt samlet i ét.
              </p>
            </div>
            <p className="text-sm sm:text-base xl:text-lg text-slate-950 dark:text-slate-300 mb-4 tracking-[-0.04em]">
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
  )
}
