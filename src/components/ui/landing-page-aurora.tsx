"use client";

import { motion } from "framer-motion";
import React from 'react';
import { PlaceholdersAndVanishInputDemo } from "./placeholders-and-vanish-input";
import Image from "next/image";
import Link from 'next/link';
import { ShimmerButtonDemo } from "./shimmer-button";
import { TextEffect } from './text_effect';
import ShapeShifter from "@/components/animata/hero/shape-shifter";

const StructuredGridBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(245,245,247)] to-[rgb(240,240,242)]" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full max-w-[1663px] h-[calc(100%-200px)] relative border border-[rgba(220,220,225,0.8)] rounded-3xl sm:rounded-[60px] md:rounded-[80px] lg:rounded-[100px] overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,220,225,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,220,225,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: '-1px -1px',
          }}
        >
          {/* Remove corner decorations as they might not fit with the rounded corners */}
        </div>
      </div>

      {/* Add gradient to white at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <StructuredGridBackground />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center justify-center space-y-6 sm:space-y-8 pt-28 xs:pt-32 sm:pt-36 lg:pt-40 xl:pt-44">
          <div className="space-y-2 sm:space-y-4 w-full text-center">
            <TextEffect
              per="char"
              preset="fade"
              delay={0.5}
              className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-slate-950 mx-auto tracking-[-0.03em]"
            >
              AI der citerer dine dokumenter.
            </TextEffect>
            <TextEffect
              per="char"
              preset="fade"
              delay={2}
              className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-slate-950 tracking-[-0.04em]"
            >
              Samtaler med citerede svar, så du er sikker på fakta.
            </TextEffect>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 3.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="space-y-6 sm:space-y-8 w-full"
          >
            <PlaceholdersAndVanishInputDemo />
            <SignInButtons />
          </motion.div>
        </div>

        {/* ShapeShifter container */}
        <div className="relative w-full" style={{ height: "calc(100vh - 400px)" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute inset-0 mt-8 sm:mt-12 lg:mt-16"
          >
            <ShapeShifter
              containerClassName="w-full h-full"
              className="w-full h-full rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const SignInButtons = () => {
  return (
    <div className="flex flex-row space-x-2 sm:space-x-3 md:space-x-6 items-stretch justify-center">
      <div className="w-36 sm:w-44">
        <ShimmerButtonDemo 
          text="Prøv gratis" 
          href="/dashboard" 
          className="w-full h-full"
        />
      </div>
      <div className="w-36 sm:w-44">
        <Link href="/dashboard" className="block h-full">
          <button className="w-full h-full group flex items-center justify-center space-x-2 bg-white text-slate-800 px-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md">
            <Image src="/google-logo.svg" alt="Google logo" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            <Image src="/linkedin-logo.svg" alt="LinkedIn logo" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
          </button>
        </Link>
      </div>
    </div>
  )
}
