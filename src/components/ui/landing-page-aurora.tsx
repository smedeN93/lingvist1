"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback, TouchEvent } from 'react';
import { AuroraBackground } from "./aurora-background";
import { PlaceholdersAndVanishInputDemo } from "./placeholders-and-vanish-input";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from 'next/link';

const ResponsiveTest = () => (
  <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white text-center py-2">
    <span className="sm:hidden">Default (&lt;640px)</span>
    <span className="hidden sm:inline md:hidden">SM (≥640px)</span>
    <span className="hidden md:inline lg:hidden">MD (≥768px)</span>
    <span className="hidden lg:inline xl:hidden">LG (≥1024px)</span>
    <span className="hidden xl:inline 2xl:hidden">XL (≥1280px)</span>
    <span className="hidden 2xl:inline">2XL (≥1536px)</span>
  </div>
);

export function LandingPage() {
  return (
    <AuroraBackground>
      <ResponsiveTest />
      <div className="relative w-full">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center px-4 space-y-4 sm:space-y-5 md:space-y-6 pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-32"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold dark:text-white text-center">
            Chat med dine dokumenter
          </h1>
          <div className="font-extralight text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl dark:text-neutral-200 text-center">
            AI. Dine dokumenter. Mere indsigt. Enkelt og ligetil.
          </div>
          
          <PlaceholdersAndVanishInputDemo />
          
          <p className="text-[9px] sm:text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400 mt-2 sm:mt-3">
            Tilmeld gratis med Email, Google eller LinkedIn
          </p>
          
          <SignInButtons />
          
          <OrDivider />
          
          <p className="text-[9px] sm:text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
            Kom i gang uden kreditkort.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-full mx-auto"
        >
          <BrowserFrameMockup 
            images={[
              "/lingvist_chat_preview15.webp",
              "/lingvist_kontrolpanel.webp",
              "/lingvist_chat_preview13.webp",
              "/lingvist_chat_preview13.1.webp",
              "/lingvist_chat_preview14.webp",
              "/lingvist_billing.webp",
              "/lingvist_billingform.webp",
            ]} 
            url="https://lingvist.dk/dashboard"
            autoSlideInterval={5000}
          />
        </motion.div>
      </div>
    </AuroraBackground>
  );
}
interface BrowserFrameMockupProps {
  images: string[];
  url?: string;
  autoSlideInterval?: number;
}

const BrowserFrameMockup: React.FC<BrowserFrameMockupProps> = ({
  images,
  url = "https://example.com/image-slider",
  autoSlideInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchDelta, setTouchDelta] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1]));

  const handleSlideChange = useCallback((newIndex: number) => {
    const adjustedIndex = (newIndex + images.length) % images.length;
    setCurrentIndex(adjustedIndex);
    const nextIndex = (adjustedIndex + 1) % images.length;
    setLoadedImages(prev => {
      const newSet = new Set(Array.from(prev));
      newSet.add(adjustedIndex);
      newSet.add(nextIndex);
      return newSet;
    });
  }, [images.length]);

  const nextSlide = useCallback(() => handleSlideChange(currentIndex + 1), [currentIndex, handleSlideChange]);
  const prevSlide = useCallback(() => handleSlideChange(currentIndex - 1), [currentIndex, handleSlideChange]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isSwiping) {
      const currentTouch = e.targetTouches[0].clientX;
      const delta = touchStart - currentTouch;
      setTouchDelta(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (Math.abs(touchDelta) > 75) {
      if (touchDelta > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchDelta(0);
  };

  useEffect(() => {
    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [nextSlide, autoSlideInterval]);

  const getImageStyle = (index: number) => {
    const baseTransform = `translateX(${(index - currentIndex) * 100}%)`;
    const swipeTransform = isSwiping ? `translateX(calc(${(index - currentIndex) * 100}% - ${touchDelta}px))` : baseTransform;
    return {
      transform: swipeTransform,
      transition: isSwiping ? 'none' : 'transform 0.3s ease-out',
    };
  };
  return (
    <div className="w-full max-w-7xl mx-auto my-4 sm:my-5 md:my-6 lg:my-8 xl:my-16 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg sm:rounded-xl lg:rounded-2xl transform scale-[1.02] blur-2xl opacity-50"></div>
        
        <div className="relative bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border-[0.5px] sm:border border-gray-200 shadow-[0_5px_20px_-10px_rgba(0,0,0,0.1)] sm:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_15px_50px_-15px_rgba(0,0,0,0.15)] sm:hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
          
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b-[0.5px] sm:border-b border-gray-200">
            <div className="flex items-center px-2 sm:px-3 py-1 sm:py-2">
              <div className="flex space-x-1 sm:space-x-1.5 mr-2 sm:mr-3">
                <div className="w-1.5 h-1.5 sm:w-2 md:w-2.5 sm:h-2 md:h-2.5 bg-red-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 md:w-2.5 sm:h-2 md:h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2 md:w-2.5 sm:h-2 md:h-2.5 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center px-2 sm:px-3 py-0.5 sm:py-1 md:py-1.5">
              <div className="flex-1 bg-white rounded-full shadow-inner flex items-center border-[0.5px] sm:border border-gray-200">
                <div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 space-x-1 sm:space-x-1.5 text-gray-500 w-full">
                  <svg className="w-2.5 h-2.5 sm:w-3 md:w-3.5 sm:h-3 md:h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[8px] sm:text-[10px] md:text-xs font-light truncate">{url}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white relative">
            <div 
              className="w-full h-0 pb-[49.66%] relative overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {images.map((img, index) => (
                <div 
                  key={index}
                  className="absolute top-0 left-0 w-full h-full"
                  style={getImageStyle(index)}
                >
                  {loadedImages.has(index) && (
                    <Image 
                      src={img}
                      alt={`Screenshot of Lingvist application ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      style={{ objectFit: 'cover' }}
                      quality={100}
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/15 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-slate-950/[0.02] pointer-events-none"></div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={prevSlide} 
              className="absolute top-1/2 left-0.5 sm:left-2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 ease-in-out shadow-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={nextSlide} 
              className="absolute top-1/2 right-0.5 sm:right-2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-1.5 sm:p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 ease-in-out shadow-sm"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>

            <div className="absolute bottom-1 sm:bottom-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-white bg-opacity-80 rounded-full px-1 py-0.5 sm:px-2 sm:py-1.5 flex space-x-0.5 sm:space-x-1.5 transition-all duration-300 hover:bg-opacity-100 shadow-sm">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlideChange(index)}
                    className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gray-800 scale-100' 
                        : 'bg-gray-400 scale-75 hover:bg-gray-600 hover:scale-90'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignInButtons = () => {
  return (
    <div className="flex flex-row space-x-2 sm:space-x-3 md:space-x-4 justify-center w-full max-w-[220px] sm:max-w-none">
      <Link href="/dashboard" passHref>
        <button className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white text-gray-700 h-7 sm:h-8 md:h-10 py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-full border border-gray-300 hover:shadow-md transition-all duration-200 text-[10px] sm:text-xs md:text-sm">
          <Image src="/google-logo.svg" alt="Google logo" width={14} height={14} className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          <span>Google</span>
        </button>
      </Link>
      <Link href="/dashboard" passHref>
        <button className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white text-gray-700 h-7 sm:h-8 md:h-10 py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-full border border-gray-300 hover:shadow-md transition-all duration-200 text-[10px] sm:text-xs md:text-sm">
          <Image src="/linkedin-logo.svg" alt="LinkedIn logo" width={14} height={14} className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          <span>LinkedIn</span>
        </button>
      </Link>
    </div>
  );
};
const OrDivider = () => {
  return (
    <div className="flex items-center w-full max-w-xs my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
  );
};

export default LandingPage;