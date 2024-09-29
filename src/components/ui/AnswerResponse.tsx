import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnswerResponseSektion } from './compare';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const AnswerResponse = () => {
  const controls = useAnimation();
  const leftControls = useAnimation();
  const rightControls = useAnimation();

  const ref = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isLeftInView = useInView(leftRef, { once: true, amount: 0.3 });
  const isRightInView = useInView(rightRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, transition: { duration: 1.2, ease: "easeOut" } });
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (isLeftInView) {
      leftControls.start({ x: 0, opacity: 1, transition: { duration: 1.5, delay: 0.4, ease: "easeOut" } });
    }
  }, [isLeftInView, leftControls]);

  useEffect(() => {
    if (isRightInView) {
      rightControls.start({ x: 0, opacity: 1, transition: { duration: 1.5, delay: 0.8, ease: "easeOut" } });
    }
  }, [isRightInView, rightControls]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className="w-full max-w-[1663px] mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 xl:space-x-12">
        <motion.div
          ref={leftRef}
          initial={{ x: -100, opacity: 0 }}
          animate={leftControls}
          className="lg:w-1/2 flex flex-col justify-start mb-6 sm:mb-8 lg:mb-0"
        >
          <div className="bg-[rgb(245,245,247)] rounded-3xl p-4 sm:p-6 lg:p-8">
            <div className="mb-2 flex items-center">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                Dialogbaseret søgning
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
                      Med Lingvist kan du hurtigt få overblik over dine dokumenter ved hjælp af kunstig intelligens. Det gør det nemt at finde relevante informationer og spare tid på manuel søgning.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold dark:text-white mb-4">
              En app der bringer <span className="text-blue-600">kunstig intelligens</span> til dine dokumenter.
            </h2>
            <p className="text-sm sm:text-base xl:text-lg text-slate-950 dark:text-slate-300">
              Lingvist gør din søgen til en samtale, så du kan finde svar på en brøkdel af tiden du plejer.
            </p>
          </div>
        </motion.div>
        <motion.div
          ref={rightRef}
          initial={{ x: 100, opacity: 0 }}
          animate={rightControls}
          className="lg:w-1/2"
        >
          <AnswerResponseSektion />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AnswerResponse;