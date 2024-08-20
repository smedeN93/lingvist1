import React from "react";
import { CheckCircle } from 'lucide-react';
import ImageScroller from "./ImageScroller";
import styles from "@/app/ImageScroller.module.css"
import { motion } from 'framer-motion';

interface ImageItem {
  image: string;
  category: string;
  description: string;
}

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  goodAt: string;
  images: ImageItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const FeatureSection: React.FC<FeatureSectionProps> = ({ title, subtitle, goodAt, images }) => {
  return (
    <motion.section 
      className="relative w-full bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="pt-8 sm:pt-10 md:pt-12 lg:pt-16 pb-16 sm:pb-20 md:pb-24 lg:pb-32 relative">
        <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 md:h-12 lg:h-16 bg-gradient-to-b from-white to-transparent z-10"></div>
        
        <div className="relative z-20 w-full mx-auto">
          <motion.div className={`${styles.scrollContainer} mb-8 sm:mb-12 lg:mb-16`} variants={itemVariants}>
            <div className="flex flex-col ml-2 sm:ml-2">
              <div className="text-left mb-4 sm:mb-6">
                <motion.h2 
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950"
                  variants={itemVariants}
                >
                  {title}
                </motion.h2>
                <motion.p 
                  className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block"
                  variants={itemVariants}
                >
                  {subtitle}
                </motion.p>
              </div>
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-blue-50 text-blue-600 text-sm sm:text-base transition-all hover:bg-blue-100 border border-blue-200 shadow-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-2.5 text-blue-600" />
                  <span>Drevet af {goodAt}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full"
            variants={itemVariants}
          >
            <ImageScroller images={images} />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0 sm:h-20 bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>
    </motion.section>
  );
}