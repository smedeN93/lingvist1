"use client";
import { motion } from "framer-motion";
import React, { useState } from 'react';
import { PlaceholdersAndVanishInputDemo } from "./placeholders-and-vanish-input";
import Image from "next/image";
import Link from 'next/link';
import AnimatedBackground from "./AnimatedBackground";

export function LandingPage() {
  const [speed, setSpeed] = useState(1);
  const [color1, setColor1] = useState('#E0E5EC'); // Lysegrå
  const [color2, setColor2] = useState('#AEB7C3'); // Mørkere grå med et strejf af blå

  return (
    <div className="relative w-full min-h-screen">
      <AnimatedBackground 
        speed={speed} 
        color1={color1} 
        color2={color2} 
      />

      <div className="relative z-10"> {/* This ensures content is above the animated background */}
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col items-center justify-center px-4 space-y-4 sm:space-y-6 pt-12 sm:pt-16 lg:pt-20 xl:pt-24"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white text-center">
            Chat med dine dokumenter
          </h1>
          <div className="font-extralight text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-neutral-200 text-center">
            AI. Dine dokumenter. Mere indsigt. Enkelt og ligetil.
          </div>
          
          <PlaceholdersAndVanishInputDemo />
          
          <p className="text-xs sm:text-sm lg:text-base text-gray-300 mt-2 sm:mt-3">
            Tilmeld gratis med Email, Google eller LinkedIn
          </p>
          
          <SignInButtons />
          
          <OrDivider />
          
          <p className="text-xs sm:text-sm lg:text-base text-gray-300 mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
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
          <StaticBrowserFrame 
            imageSrc="/lingvist_chat_preview15.webp"
            url="https://lingvist.dk/dashboard"
          />
        </motion.div>
      </div>
    </div>
  );
}
interface StaticBrowserFrameProps {
  imageSrc: string;
  url?: string;
}

const StaticBrowserFrame: React.FC<StaticBrowserFrameProps> = ({
  imageSrc,
  url = "https://example.com/static-image"
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto my-6 lg:my-16 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl transform scale-[1.02] blur-2xl opacity-50"></div>
        
        <div className="relative bg-white rounded-xl lg:rounded-3xl overflow-hidden border-[0.5px] sm:border border-gray-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)]">
          
          <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b-[0.5px] sm:border-b border-gray-200">
            <div className="flex items-center px-2 sm:px-3 py-1 sm:py-2">
              <div className="flex space-x-1 sm:space-x-1.5 mr-2 sm:mr-3">
                <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center px-2 sm:px-3 py-0.5 sm:py-1.5">
              <div className="flex-1 bg-white rounded-full shadow-inner flex items-center border-[0.5px] sm:border border-gray-200">
                <div className="flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 space-x-1 sm:space-x-1.5 text-gray-500 w-full">
                  <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[8px] sm:text-xs font-light truncate">{url}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white relative">
            <div className="w-full h-0 pb-[49.66%] relative overflow-hidden">
              <Image 
                src={imageSrc}
                alt="Screenshot of Lingvist application"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                style={{ objectFit: 'cover' }}
                quality={100}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/15 pointer-events-none"></div>
              <div className="absolute inset-0 bg-slate-950/[0.02] pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignInButtons = () => {
  return (
    <div className="flex flex-row space-x-2 sm:space-x-4 justify-center w-full max-w-[200px] sm:max-w-none">
      <Link href="/dashboard" passHref>
        <button className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white text-gray-700 h-7 sm:h-auto sm:py-2 px-2 sm:px-4 rounded-full border border-gray-300 hover:shadow-md transition-all duration-200 text-[10px] sm:text-sm">
          <Image src="/google-logo.svg" alt="Google logo" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Google</span>
        </button>
      </Link>
      <Link href="/dashboard" passHref>
        <button className="flex items-center justify-center space-x-1 sm:space-x-2 bg-white text-gray-700 h-7 sm:h-auto sm:py-2 px-2 sm:px-4 rounded-full border border-gray-300 hover:shadow-md transition-all duration-200 text-[10px] sm:text-sm">
          <Image src="/linkedin-logo.svg" alt="LinkedIn logo" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
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