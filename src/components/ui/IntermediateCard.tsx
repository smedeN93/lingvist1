import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { TypewriterEffectSmooth } from './TypewriterEffectSmooth';
import { FileUp, MessageSquare, Bot, ChevronRight, ChevronLeft, ArrowRight, BarChart, ArrowUpRight} from 'lucide-react';
import ShimmerButton from "@/components/ui/shimmer-button";
import { ChartForSmallCard, RAGImprovementChart } from './Chart_cards';
import PDFChatFlow from './PdfChatFlow';
import ComprehensiveRAGVisualization from './RAGProcess';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';

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

const RAGProcessDialog: React.FC = () => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <ShimmerButton className="w-full bg-blue-600">
        <span className="text-white flex items-center justify-center whitespace-nowrap text-xs sm:text-sm font-medium leading-none tracking-tight">
          Se Processen
          <ArrowUpRight className=" ml-2 h-4 w-4 flex-shrink-0" />
        </span>
      </ShimmerButton>
    </AlertDialogTrigger>
    <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <AlertDialogHeader className="sr-only">
        <AlertDialogTitle>Retrieval-Augmented Generation (RAG) Proces</AlertDialogTitle>
        <AlertDialogDescription>
          Udforsk den detaljerede proces bag RAG-teknologien.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <ComprehensiveRAGVisualization />
      <div className="mt-6 flex justify-end">
        <AlertDialogCancel className="px-4 py-2 bg-slate-950 text-white rounded hover:bg-slate-700 hover:text-white transition-colors text-sm">
          Luk
        </AlertDialogCancel>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

interface SmallCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  children?: React.ReactNode;
}

const SmallCard: React.FC<SmallCardProps & { contentClassName?: string }> = ({ icon, title, description, href, children, contentClassName }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-md border border-gray-100 w-full h-full flex flex-col justify-between relative lg:min-h-[300px] transition-all duration-300 hover:shadow-lg hover:border-gray-200">
    <div className={`flex flex-col h-full ${contentClassName}`}>
      <div className="text-slate-950 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-slate-950">{title}</h3>
      <p className="text-sm text-slate-950 mb-2">{description}</p>
      {children}
    </div>
    <Link href={href} className="absolute bottom-4 right-4 w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center transition-colors hover:bg-slate-800">
      <ChevronRight size={20} className="text-white" />
    </Link>
  </div>
);
const SmallCardScroller: React.FC<{ cards: SmallCardProps[] }> = ({ cards }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.querySelector('.card-wrapper')?.clientWidth || 0;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="relative max-w-full overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12"
        style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        onScroll={checkScrollability}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {cards.map((card, index) => (
          <div key={index} className="card-wrapper w-full sm:w-1/2 xl:w-1/3 flex-shrink-0 px-2 first:pl-4 last:pr-4 snap-center">
            <SmallCard {...card} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-4 flex space-x-4">
        <button
          onClick={() => scroll('left')}
          className={`bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 focus:outline-none transition-colors duration-200 ${
            !canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className={`bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 focus:outline-none transition-colors duration-200 ${
            !canScrollRight ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
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

interface IntermediateCardProps {
  title: string;
  animatedTexts: string[];
  buttonText: string;
  buttonHref: string;
  descriptionText: string;
}

const IntermediateCard: React.FC<IntermediateCardProps> = ({
  title,
  animatedTexts,
  buttonText,
  buttonHref,
  descriptionText,
}) => {
  const smallCards: (SmallCardProps & { contentClassName?: string })[] = [
    { 
      icon: <BarChart size={32} />, 
      title: "Få 29% mere nøjagtighed i svar.", 
      description: "Nøjagtighed. 29% mere end standard AI er mærkbart. Hvad forventer man ellers ved at lede timevis efter svar i en PDF?*", 
      href: "/dashboard",
      children: <ChartForSmallCard className="mt-0 h-48" />,
      contentClassName: "justify-start"
    },
    { 
      icon: <BarChart size={32} />, 
      title: "22% skarpere til spørgsmål specifikke for PDF'er.", 
      description: "Vi kender det alle. AI kan begynde at hallucinere.Med Lingvist arkitektur har vi barberet det markant ned.*", 
      href: "/dashboard",
      children: <RAGImprovementChart className="mt-0 h-48" />,
      contentClassName: "justify-start"
    },
      {
        icon: <FileUp size={32} />,
        title: "Sådan virker det - få trin og du er i gang.",
        description: "Det er enkelt og ligetil. Du uploader blot din PDF, og begynder at samtale med det. Lige så snart din PDF er uploadet, så har vi sørget for, at den primære informationskilde til dine svar er afgrænset til dit dokument.",
        href: "/dashboard",
        children: <PDFChatFlow />,
        contentClassName: "justify-start"
      },
      { 
        icon: <MessageSquare size={32} />, 
        title: "Vi har også beskrevet teknikken. Tjek den ud.", 
        description: "Der skal åbenhed til. Det mener vi i hvert fald. Lingvist bruger en metode som hedder 'RAG'. Man kan se det som en slags ovenbygning på standard AI. Se vores trin-for-trin beskrivelse af teknikken bag Lingvist.", 
        href: "/dashboard",
        children: (
          <div className="mt-20">
            <RAGProcessDialog />
          </div>
        )
      }
  ];


  return (
    <motion.div 
      className="bg-[rgb(245,245,247)] rounded-[24px] p-4 sm:p-6 w-full max-w-[1663px] mx-auto overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex flex-col xl:flex-row xl:items-stretch xl:space-x-8 h-full">
        <div className="xl:w-1/3 flex flex-col justify-between xl:justify-start h-full">
          <div>
            <motion.h2 
              className="text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-slate-950 tracking-[-0.04em]"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
            <motion.div className="mb-2 tracking-[-0.04em]" variants={itemVariants}>
              <TypewriterEffectSmooth words={animatedTexts} className="text-blue-600" infinite={false}/>
            </motion.div>
            <motion.p 
              className="text-sm sm:text-base xl:text-lg text-slate-950 mb-2 tracking-[-0.04em]"
              variants={itemVariants}
            >
              {descriptionText}
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="mt-4 xl:mt-0">
            <ShimmerButtonDemo text={buttonText} href={buttonHref} />
          </motion.div>
        </div>

        <motion.div 
          className="xl:w-2/3 mt-6 xl:mt-0 h-full"
          variants={itemVariants}
        >
          <SmallCardScroller cards={smallCards} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntermediateCard;