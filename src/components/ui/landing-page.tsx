"use client";

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { motion } from "framer-motion";
import PageIllustration from "./landing-page-illustration";
import ShapeShifter from "../animata/hero/shape-shifter";
import { ShimmerButtonDemo } from "./shimmer-button";
import { PlaceholdersAndVanishInputDemo } from "./placeholders-and-vanish-input";
import { LingvistUsers } from "./animated-tooltip";

export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div
              className="mb-6 border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]"
              data-aos="zoom-y-out"
            >
              <div className="-mx-0.5 flex justify-center -space-x-3">
                <LingvistUsers />
              </div>
            </div>

            <h1
              className="mb-6 border-y text-4xl sm:text-5xl font-bold tracking-[-0.05em] [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              <span className="sm:whitespace-nowrap">AI der citerer</span>{' '}
              <span className="sm:whitespace-nowrap">dine dokumenter.</span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700 tracking-[-0.04em] border-y [border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1] py-2"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Hurtigt find den viden du har brug for, og få citerede svar, så du er sikker på fakta.
              </p>
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
                <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,theme(colors.slate.300/.8),transparent)1]">
                  <SignInButtons />
                </div>
              </motion.div>
            </div>
          </div>
          {/* ShapeShifter component */}
          <div className="relative w-full" style={{ height: "calc(100vh - 400px)" }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.8,
                ease: "easeInOut",
              }}
              className="absolute inset-0 mt-4 sm:mt-6 lg:mt-8"
            >
              <ShapeShifter
                containerClassName="w-full h-full"
                className="w-full h-full rounded-3xl shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SignInButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-6 items-stretch justify-center">
      <div className="w-36 sm:w-44 mx-auto sm:mx-0">
        <ShimmerButtonDemo 
          text="Prøv gratis" 
          href="/dashboard" 
          width="w-full"
          padding="px-3 sm:px-5 lg:px-7 py-1.5 sm:py-2.5 lg:py-3.5"
          className="h-full"
        />
      </div>
      <div className="w-36 sm:w-44 mx-auto sm:mx-0">
        <Link href="/dashboard" className="block h-full">
          <button className="w-full h-full group flex items-center justify-center space-x-2 bg-white text-slate-800 px-3 sm:px-5 lg:px-7 py-1.5 sm:py-2.5 lg:py-3.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-all duration-200 text-xs sm:text-sm lg:text-base font-medium shadow-sm hover:shadow-md">
            <span className="flex items-center space-x-2">
              <Image src="/google-logo.svg" alt="Google logo" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              <Image src="/linkedin-logo.svg" alt="LinkedIn logo" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            </span>
          </button>
        </Link>
      </div>
    </div>
  )
}
