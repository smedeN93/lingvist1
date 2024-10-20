import React, { useState, lazy, Suspense } from 'react';
import { ChevronUp, ChevronDown, Shield, Lock, FileCheck, ArrowRight } from 'lucide-react';
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from 'next/link';
import { motion } from 'framer-motion';


const AnimatedBeamMultipleOutputDemo = lazy(() => import('./animated-beam').then(module => ({ default: module.AnimatedBeamMultipleOutputDemo })));

const ExpandableSection: React.FC<{
  title: string;
  content: string;
  isExpanded: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  showAnimation: boolean;
}> = ({ title, content, isExpanded, onToggle, icon, showAnimation }) => {
  return (
    <div className="border-b border-gray-300 py-4 md:py-6">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={onToggle}
      >
        <span className="flex items-center font-semibold text-lg md:text-xl">
          {icon}
          <span className="ml-3">{title}</span>
        </span>
        {isExpanded ? <ChevronUp className="w-5 h-5 md:w-6 md:h-6" /> : <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />}
      </button>
      {isExpanded && (
        <div className="mt-4">
          <p className="text-sm lg:text-base text-slate-950">{content}</p>
          {showAnimation && (
            <div className="mt-6 lg:hidden">
              <Suspense fallback={<div>Loading...</div>}>
                <AnimatedBeamMultipleOutputDemo />
              </Suspense>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ShimmerButtonDemo: React.FC<{ text: string; href: string }> = ({ text, href }) => {
  return (
    <Link href={href} className="z-10 inline-block">
      <ShimmerButton className="shadow-xl">
        <span className="flex items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
          {text}
          <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
        </span>
      </ShimmerButton>
    </Link>
  );
};

const SecurityInfoCard: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState(0);

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? -1 : index);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div 
      className="bg-[rgb(245,245,247)] rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-[1663px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.div className="flex flex-col mb-6 lg:mb-8" variants={itemVariants}>
        <div className="mb-4 lg:mb-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950 tracking-[-0.04em]">
            Sikkerhed. Selvfølgelig.
          </h2>
          <p className="text-blue-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block tracking-[-0.04em]">
            Se hvordan.
          </p>
        </div>
        <div className="mt-2">
          <ShimmerButtonDemo text="Prøv gratis" href="/dashboard" />
        </div>
      </motion.div>
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 xl:space-x-12">
        <motion.div className="lg:w-1/2 flex flex-col justify-start mb-6 lg:mb-0" variants={itemVariants}>
          <div className="space-y-4 md:space-y-6">
            <ExpandableSection
              title="Sikker dokumenthåndtering"
              content="Vi har alle tænkt tanken: Gad vide hvem der har adgang til mine data, når jeg bruger AI? Det har vi i hvert fald tænkt, og vi mener, at du ikke skal udlevere dine data til hvem som helst for at få brugbar AI. Det burde være en selvfølge, og hos os er det det. Vi benytter derfor anerkendte og sikre cloudtjenester, der beskytter dine PDF-dokumenter, spørgsmål og svar med kryptering - både når data er i hvile og under overførsel."
              isExpanded={expandedSection === 0}
              onToggle={() => toggleSection(0)}
              icon={<Shield className="w-5 h-5 md:w-6 md:h-6 text-slate-950" />}
              showAnimation={expandedSection === 0}
            />
            <ExpandableSection
              title="Sikker brugeradgang"
              content="Adgangsstyring er rygraden i Lingvists sikkerhedsstruktur. Vi har implementeret en pålidelig autentificeringsløsning og anvender multifaktorautentificering samt rollebaseret adgang. Dét, kombineret med kryptering, gør at vi følger med bedste praksis inden for moderne virksomheders sikkerhedsstandarder. Naturligvis."
              isExpanded={expandedSection === 1}
              onToggle={() => toggleSection(1)}
              icon={<Lock className="w-5 h-5 md:w-6 md:h-6 text-slate-950" />}
              showAnimation={expandedSection === 1}
            />
            <ExpandableSection
              title="Ansvarlig databehandling"
              content="Lingvist har selvfølgelig en infrastruktur, der overholder GDPR. Ved at bruge moderne teknologier til dataopbevaring og hosting, sikrer vi, at dine PDF'er, spørgsmål og svar forbliver helt private og behandles i overensstemmelse med gældende lovgivning. Selvfølgelig."
              isExpanded={expandedSection === 2}
              onToggle={() => toggleSection(2)}
              icon={<FileCheck className="w-5 h-5 md:w-6 md:h-6 text-slate-950" />}
              showAnimation={expandedSection === 2}
            />
          </div>
        </motion.div>
        <motion.div className="hidden lg:flex lg:w-1/2 items-center justify-center" variants={itemVariants}>
          <div className="w-full max-w-md lg:max-w-full">
            <Suspense fallback={<div>Loading...</div>}>
              <AnimatedBeamMultipleOutputDemo />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecurityInfoCard;