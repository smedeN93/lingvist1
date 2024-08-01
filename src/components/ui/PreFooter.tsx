import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

// Lazy load components
const LingvistUsers = lazy(() => import('./animated-tooltip').then(module => ({ default: module.LingvistUsers })));
const TypewriterEffectSmooth = lazy(() => import('./TypewriterEffectSmooth').then(module => ({ default: module.TypewriterEffectSmooth })));

const PreFooter: React.FC = () => {
  const userTypes = [
    "Studerende.",
    "Ledere.",
    "Forskere.",
    "Forfattere.",
    "Journalister.",
    "Oversættere.",
    "Undervisere.",
    "Iværksættere.",
    "Konsulenter."
  ];

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1],
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      ref={ref}
      className="bg-black rounded-3xl p-8 sm:p-12 w-full max-w-[1663px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <motion.div className="lg:w-2/3" variants={childVariants}>
          <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" variants={childVariants}>
            Klar til at prøve Lingvist? <br/> Flere er i gang.
          </motion.h2>
          <Suspense fallback={<div className="text-[#e0e0e2] text-lg sm:text-xl mb-2">Loading...</div>}>
            <TypewriterEffectSmooth
              words={userTypes}
              className="text-[#e0e0e2] text-lg sm:text-xl mb-2"
              infinite={true}
            />
          </Suspense>
          <Suspense fallback={<div className="h-20 bg-gray-700 rounded animate-pulse"></div>}>
            <LingvistUsers />
          </Suspense>
        </motion.div>
        <motion.div 
          className="lg:w-1/3 flex flex-row justify-center lg:justify-start items-center gap-4 lg:self-center w-full"
          variants={childVariants}
        >
          
            <Link href="/dashboard" className="flex-1 max-w-[168px] sm:max-w-[192px] md:max-w-[224px] inline-block px-6 py-3 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-colors duration-300 text-center">
              Log Ind
            </Link>
          
          
            <Link href="/dashboard" className="flex-1 max-w-[168px] sm:max-w-[192px] md:max-w-[224px] inline-block px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors duration-300 text-center">
              Tilmeld
            </Link>
          
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PreFooter;