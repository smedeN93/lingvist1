'use client'

import React, { HTMLAttributes, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import ShimmerButton from "@/components/ui/shimmer-button"
import Image from "next/image"

interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  item: { image: string; title: string }
  index: number
  activeItem: number
}

interface ExpandableProps {
  title: string
  staticText: string
  descriptionText: string
  buttonText: string
  buttonHref: string
  list?: { image: string; title: string }[]
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
        "relative flex h-full w-20 min-w-10 cursor-pointer overflow-hidden rounded-md transition-all delay-0 duration-300 ease-in-out",
        {
          "flex-grow": index === activeItem,
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
      {index === activeItem && (
        <div className="absolute bottom-4 left-4 min-w-fit text-white md:bottom-8 md:left-8 z-20">
          <WaveReveal
            duration="1000ms"
            className="items-start justify-start text-xl sm:text-2xl md:text-6xl"
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
    image:
      "/lingvist_chat_preview15.webp",
    title: "Mountains",
  },
  {
    image:
      "/tematisk-filtrering_preview.png",
    title: "Great Wall of China",
  },
  {
    image:
      "/citat_preview.png",
    title: "Texture & Patterns",
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
  title,
  staticText,
  descriptionText,
  buttonText,
  buttonHref,
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
      className={cn("bg-[rgb(245,245,247)] rounded-[24px] p-4 sm:p-6 w-full max-w-[1663px] mx-auto overflow-hidden", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex flex-col xl:flex-row xl:items-stretch xl:space-x-8 h-full">
        <div className="xl:w-1/3 flex flex-col justify-between xl:justify-start h-full">
          <div>
            <motion.h2 
              className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-slate-950"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="text-sm sm:text-base xl:text-lg text-blue-600 mb-2"
              variants={itemVariants}
            >
              {staticText}
            </motion.p>
            <motion.p 
              className="text-sm sm:text-base xl:text-lg text-slate-950 mb-2"
              variants={itemVariants}
            >
              {descriptionText}
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="mt-4 xl:mt-0">
            <ShimmerButtonDemo text={buttonText} href={buttonHref} />
          </motion.div>
        </div>

        <motion.div 
          className="xl:w-2/3 mt-6 xl:mt-0 h-full"
          variants={itemVariants}
        >
          <div className="flex h-[500px] w-full gap-1">
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
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Expandable