'use client'

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from "@/app/ImageScroller.module.css"
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface ImageCardProps {
  image: string;
  category: string;
  description: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, category, description }) => (
  <motion.div 
    className="relative flex-shrink-0 w-[calc(80vw-2rem)] sm:w-[calc(70vw-2rem)] md:w-[calc(60vw-2rem)] lg:w-[calc(45vw-2rem)] xl:w-[calc(35vw-2rem)] max-w-[500px] aspect-[3/4] rounded-3xl overflow-hidden mx-3 transition-all duration-300 ease-in-out group shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Image 
      src={image} 
      alt={`${category}: ${description}`}
      fill
      sizes="(max-width: 640px) 80vw, (max-width: 768px) 70vw, (max-width: 1024px) 60vw, (max-width: 1280px) 45vw, 35vw"
      className="object-cover transition-all duration-300 group-hover:scale-105"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 group-hover:from-black/20 group-hover:to-black/40 transition-all duration-300"></div>
    <div className="absolute inset-x-0 top-0 p-6 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-[2px] transition-all duration-300 group-hover:backdrop-blur-[4px]">
      <p className="text-white text-sm font-medium tracking-wide mb-2 transition-all duration-300 group-hover:text-white">{category}</p>
      <p className="text-white text-xl sm:text-2xl md:text-3xl font-semibold leading-tight transition-all duration-300">{description}</p>
    </div>
    <Link 
      href="/dashboard" 
      className="absolute bottom-4 right-4 bg-white/30 hover:bg-white/40 rounded-full p-2 transition-all duration-200 backdrop-blur-[2px] group-hover:backdrop-blur-[4px]"
      aria-label={`View dashboard for ${category}: ${description}`}
      title="Go to Dashboard"
    >
      <ChevronRight className="w-5 h-5 text-white" />
    </Link>
  </motion.div>
);
interface ImageScrollerProps {
  images: ImageCardProps[];
}

const ImageScroller: React.FC<ImageScrollerProps> = ({ images }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 0;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="relative max-w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-16 ${styles.scrollContainer}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth',
        }}
        onScroll={checkScrollability}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {images.map((img, index) => (
          <div key={index} className="flex-shrink-0 snap-center">
            <ImageCard {...img} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-6 lg:right-60 sm:right-5 md:right-6 flex space-x-3 sm:space-x-4">
        <button
          onClick={() => scroll('left')}
          className={`bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 sm:p-2.5 md:p-3 focus:outline-none transition-colors duration-200 ${
            !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className={`bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 sm:p-2.5 md:p-3 focus:outline-none transition-colors duration-200 ${
            !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ImageScroller;