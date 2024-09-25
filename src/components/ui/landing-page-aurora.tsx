"use client";

import { motion } from "framer-motion";
import React from 'react';
import { PlaceholdersAndVanishInputDemo } from "./placeholders-and-vanish-input";
import Image from "next/image";
import Link from 'next/link';
import { ShimmerButtonDemo } from "./shimmer-button";

const StructuredGridBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(245,245,247)] to-[rgb(240,240,242)]" />
      
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.5) 85%, rgba(255,255,255,1) 100%)'
        }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full max-w-[1663px] h-full relative border border-[rgba(220,220,225,0.8)]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,220,225,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,220,225,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px',
            backgroundPosition: '-1px -1px',
          }}
        >
          <div 
            className="absolute -top-[1.5px] -left-[1.5px]" 
            style={{
              width: '60px',
              height: '60px',
              borderTop: '1.5px solid rgba(210,210,215,1)',
              borderLeft: '1.5px solid rgba(210,210,215,1)',
            }}
          />
          <div 
            className="absolute -bottom-[1.5px] -right-[1.5px]" 
            style={{
              width: '60px',
              height: '60px',
              borderBottom: '1.5px solid rgba(210,210,215,1)',
              borderRight: '1.5px solid rgba(210,210,215,1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen">
      <StructuredGridBackground />
      
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center space-y-4 sm:space-y-6 pt-28 xs:pt-32 sm:pt-36 lg:pt-40 xl:pt-44"
        >
          <div className="space-y-0 sm:space-y-2 w-full text-center">
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-950 mx-auto">
              Chat med dine dokumenter<span className="text-blue-600">.</span>
            </h1>
            <div className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-extralight text-slate-950">
              AI der citerer direkte fra dine dokumenter<span className="text-blue-600 text-[1.5em]">.</span>
            </div>
          </div>
          
          <PlaceholdersAndVanishInputDemo />
          
          <p className="text-xs sm:text-sm lg:text-base text-slate-750 mt-2 sm:mt-3">
            Tilmeld gratis med Email, Google eller LinkedIn
          </p>
          
          <SignInButtons />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-full mx-auto mt-8 sm:mt-12 lg:mt-16 px-0 sm:px-4 lg:px-6"
        >
          <div className="relative w-full mx-auto">
            <Image 
              src="/lingvist_chat_preview15.webp"
              alt="Screenshot of application"
              width={3840}
              height={1907}
              className="w-full h-auto rounded-lg sm:rounded-2xl shadow-lg"
              quality={100}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 80vw"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const SignInButtons = () => {
  return (
    <div className="flex flex-row space-x-2 sm:space-x-3 md:space-x-6 items-stretch justify-center">
      <div className="w-36 sm:w-44">
        <ShimmerButtonDemo 
          text="Prøv det gratis" 
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