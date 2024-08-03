import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { AnswerResponseSektion } from './compare';

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
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold dark:text-white mb-4">
              En app der bringer <span className="text-blue-600">kunstig intelligens</span> til dine dokumenter.
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-normal sm:font-medium text-slate-950 dark:text-slate-300">
              Lingvist forvandler dine dokumenter til samtalepartnere. Find svar, opsummér indhold og skab nyt - alt sammen på brøkdel af tiden du plejer. Som vidensarbejder har du vigtigere ting at bruge din tid på.
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