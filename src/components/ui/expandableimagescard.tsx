'use client'

import React, { HTMLAttributes, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import ShimmerButton from "@/components/ui/shimmer-button"
import Image from "next/image"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  item: { image: string; title: string; subtitle: string }
  index: number
  activeItem: number
}

interface ExpandableProps {
  list?: { image: string; title: string; subtitle: string }[]
  autoPlay?: boolean
  className?: string
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

const WaveReveal: React.FC<{
  text: string
  duration?: string
  className?: string
  direction?: 'up' | 'down'
}> = ({ text, duration = '1000ms', className = '', direction = 'up' }) => {
  return (
    <div className={cn('flex flex-wrap', className)}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className={cn(
            'inline-block animate-wave-reveal opacity-0',
            direction === 'up' ? 'animate-wave-reveal-up' : 'animate-wave-reveal-down'
          )}
          style={{ animationDelay: `${index * 0.05}s`, animationDuration: duration }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}

const List: React.FC<ImageProps> = ({ item, className, index, activeItem, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer overflow-hidden rounded-md transition-all delay-0 duration-300 ease-in-out shadow-xl",
        {
          "h-[70%] lg:w-[70%]": index === activeItem,
          "h-[15%] lg:w-[15%]": index !== activeItem,
        },
        className,
      )}
      {...props}
    >
      <div className={cn(
        "absolute inset-0 z-10 transition-opacity duration-300",
        index === activeItem ? "opacity-0" : "opacity-100"
      )}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
      </div>
      <Image
        src={item.image}
        alt={item.title}
        fill
        className={cn(
          "object-cover transition-all duration-300",
          "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
          "outline outline-2 outline-white/10",
          index === activeItem ? "scale-105" : "scale-100"
        )}
      />
      <div className="absolute inset-x-0 bottom-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white text-lg font-semibold mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{item.title}</h3>
        <p className="text-white/90 text-sm font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">{item.subtitle}</p>
      </div>
      {index === activeItem && (
        <div className="absolute top-4 left-4 min-w-fit text-white md:top-8 md:left-8 z-20">
          <WaveReveal
            duration="1000ms"
            className="items-start justify-start text-xl sm:text-2xl md:text-4xl font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
            text={item.title}
            direction="up"
          />
        </div>
      )}
    </div>
  )
}

const items = [
  {
    image: "/lingvist_chat_preview15.webp",
    title: "AI-dreven notatskrivning",
    subtitle: "Få AI som hjælper dig med at skrive notater.",
  },
  {
    image: "/tematisk-filtrering_preview.png",
    title: "Tematisk filtrering",
    subtitle: "Filtrér dine søgninger efter emne, så du får de mest relevante svar.",
  },
  {
    image: "/citat_preview.png",
    title: "Præcis citering",
    subtitle: "Få citeringer i dine svar, så du kan få vist hvilken kilde, AI'en har fået svaret fra.",
  },
]

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

const Expandable: React.FC<ExpandableProps> = ({
  list = items,
  autoPlay = true,
  className
}) => {
  const [activeItem, setActiveItem] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!autoPlay) {
      return
    }

    const interval = setInterval(() => {
      if (!isHovering) {
        setActiveItem((prev) => (prev + 1) % list.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlay, list.length, isHovering])

  return (
    <motion.div 
      className={cn("bg-[rgb(245,245,247)] rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-[1663px] mx-auto overflow-hidden", className)}
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
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950">
              Søgninger, citeringer og notatskrivning.
            </h2>
            <p className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block">
              Alt samlet i ét.
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

        <motion.div 
          className="lg:w-1/2 mt-6 lg:mt-0 h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row h-full w-full gap-1">
            {list.map((item, index) => (
              <List
                key={item.title}
                item={item}
                index={index}
                activeItem={activeItem}
                onMouseEnter={() => {
                  setActiveItem(index)
                  setIsHovering(true)
                }}
                onMouseLeave={() => {
                  setIsHovering(false)
                }}
                className="w-full lg:h-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Expandable