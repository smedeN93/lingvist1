import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { CompareImage } from './compare-image';
import { Info, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const AnswerResponse = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } });
    }
  }, [isInView, controls]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="w-full max-w-[1663px] mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-xl">
          <div className="mb-4 flex items-center">
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-white mb-4 tracking-[-0.04em]">
            En app der bringer <span className="text-blue-600">kunstig intelligens</span> til dine dokumenter.
          </h2>
          <p className="text-sm sm:text-base text-slate-950 dark:text-slate-300 tracking-[-0.04em]">
            Lingvist gør din søgen til en samtale, så du kan finde svar på en brøkdel af tiden du plejer.
          </p>
        </div>
      </div>
      <div className="w-full">
        <CompareImage
          firstImage="/lingvist-chat-preview.webp"
          secondImage="/lingvist-dashboard-preview.webp"
          alt="Screenshot of application"
          width={3840}
          height={1907}
        />
      </div>
    </motion.section>
  );
};

export default AnswerResponse;
