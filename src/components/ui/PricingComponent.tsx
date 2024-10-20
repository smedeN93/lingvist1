import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, CheckCircle2, } from 'lucide-react';
import ShimmerButton from "@/components/ui/shimmer-button";
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';


interface Feature {
  text: string;
}

interface PlanProps {
  title: string;
  price: string;
  features: Feature[];
  buttonText: string;
  isPopular?: boolean;
  isDark?: boolean;
  gradientBackground?: string;
  borderColor?: string;
  shadowClass?: string;
  comingSoon?: boolean;
  onButtonClick: () => void;
}

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

const PricingCard: React.FC<PlanProps> = ({ 
  title, 
  price, 
  features, 
  buttonText, 
  isPopular = false, 
  isDark = false, 
  onButtonClick,
  gradientBackground = '',
  borderColor = '',
  shadowClass = 'shadow-md',
  comingSoon = false,
}) => (
  <div className={`
    rounded-3xl p-6 xl:p-8 
    ${isDark ? 'bg-black text-white' : gradientBackground || 'bg-white'} 
    ${borderColor}
    flex flex-col h-full relative xl:min-h-[300px]
    ${shadowClass}
    ${isDark ? 'text-white' : 'text-slate-950'}
  `}>
    {isPopular && (
  <div className="absolute top-3 right-3 bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(255,255,255,0.2)]">
    Mest Populær
  </div>
)}
{comingSoon && (
  <div className="absolute top-3 right-3 bg-slate-950 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.15)]">
    Kommer snart
  </div>
)}
    <h3 className={`text-xl md:text-2xl xl:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{title}</h3>
    <div className="mb-6">
      <span className={`text-2xl md:text-3xl xl:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>{price}</span>
      {price !== 'Kontakt os' && <span className={`text-sm md:text-base ${isDark ? 'text-gray-300' : 'text-gray-500'}`}> / måned</span>}
    </div>
    <ul className="space-y-3 xl:space-y-4 mb-6 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckCircle2 className={`w-4 h-4 xl:w-5 xl:h-5 mr-2 flex-shrink-0 mt-[0.2em] ${
            isDark ? 'text-green-400' : 'text-slate-950'
          }`} />
          <span className={`text-sm xl:text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>{feature.text}</span>
        </li>
      ))}
    </ul>
    <button
      onClick={onButtonClick}
      className={`w-full py-3 px-4 rounded-full font-bold text-sm xl:text-base ${
        isDark
          ? 'bg-green-400 text-black hover:bg-green-500'
          : 'bg-black text-white hover:bg-gray-800'
      } transition-colors duration-200`}
    >
      {buttonText}
    </button>
  </div>
);

const PricingCardScroller: React.FC<{ cards: React.ReactNode[] }> = ({ cards }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isMediumOrLargeScreen, setIsMediumOrLargeScreen] = useState(false);

  const totalCards = cards.length;

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / (isMediumOrLargeScreen ? 2 : 1);
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, [isMediumOrLargeScreen]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollPosition = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth / (isMediumOrLargeScreen ? 2 : 1);
      let newIndex = Math.round(scrollPosition / cardWidth);
  
      if (newIndex >= totalCards) {
        newIndex = 0;
        scrollToIndex(0, false);
      } else if (newIndex < 0) {
        newIndex = totalCards - 1;
        scrollToIndex(totalCards - 1, false);
      }
  
      setCurrentIndex(newIndex);
    }
  }, [isMediumOrLargeScreen, totalCards, scrollToIndex]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    let newIndex = direction === 'left' 
      ? (currentIndex - 1 + totalCards) % totalCards 
      : (currentIndex + 1) % totalCards;
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  }, [currentIndex, totalCards, scrollToIndex]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    setIsUserInteracting(true);
    scroll(direction);
    setTimeout(() => setIsUserInteracting(false), 5000);
  };

  useEffect(() => {
    const handleResize = () => {
      const mediumOrLargeScreen = window.innerWidth >= 768 && window.innerWidth < 1280;
      setIsMediumOrLargeScreen(mediumOrLargeScreen);
      if (scrollContainerRef.current) {
        if (mediumOrLargeScreen) {
          // On medium or large screens, scroll to show the first two cards
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: 'auto'
          });
        }
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const autoScrollTimer = setInterval(() => {
      if (!isUserInteracting) {
        scroll('right');
      }
    }, 5000);
  
    return () => clearInterval(autoScrollTimer);
  }, [isUserInteracting, scroll]);
  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="relative max-w-full overflow-hidden"
         onMouseEnter={() => setIsUserInteracting(true)}
         onMouseLeave={() => setIsUserInteracting(false)}
         onTouchStart={() => setIsUserInteracting(true)}
         onTouchEnd={() => setTimeout(() => setIsUserInteracting(false), 5000)}>
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12"
        style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {cards.map((card, index) => (
          <div key={index} className="w-full md:w-1/2 xl:w-full flex-shrink-0 px-2 first:pl-4 last:pr-4 snap-center">
            {card}
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-4 flex space-x-4 xl:hidden">
        <button
          onClick={() => handleManualScroll('left')}
          className="bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 focus:outline-none transition-colors duration-200"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-white" />
        </button>
        <button
          onClick={() => handleManualScroll('right')}
          className="bg-slate-950 hover:bg-slate-950/50 rounded-full p-2 focus:outline-none transition-colors duration-200"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-white" />
        </button>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {cards.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-slate-950' : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const PricingComponent: React.FC = () => {
  const handleEnterpriseBtnClick = () => {
    window.location.href = 'mailto:lingvist@kontakt.dk';
  };

  const pricingCards = [
    <PricingCard
      key="free"
      title="Gratis"
      price="0 kr"
      features={[
        { text: "Dybdegående svar baseret på hele dokumentets kontekst"},
        { text: "Begrænset til 10 PDFs/måned" },
        { text: "Maksimum 15 sider pr. PDF" },
        { text: "Op til 4 MB filstørrelse" },
        { text: "Basal e-mail support" }
      ]}
      buttonText="Start nu →"
      gradientBackground="bg-gradient-to-br from-white to-gray-100"
      borderColor="border border-gray-200"
      shadowClass="shadow-lg"
      onButtonClick={() => {}}
    />,
    <PricingCard
      key="pro"
      title="Pro"
      price="29,95 kr"
      features={[
        { text: "Dybdegående svar baseret på hele dokumentets kontekst"},
        { text: "Høj kvote på 50 PDFs/måned" },
        { text: "Helt op til 50 sider pr. PDF" },
        { text: "Omfattende 16 MB filstørrelse" },
        { text: "Prioriteret support med hurtig responstid" },
        { text: "Ubegrænset søgehistorik" }
      ]}
      buttonText="Start nu →"
      isPopular={true}
      isDark={true}
      onButtonClick={() => {}}
    />,
    <PricingCard
      key="enterprise"
      title="Enterprise"
      price="Kontakt os"
      features={[
        { text: "AI trænet på jeres virksomhedsdata"},
        { text: "Indsigt på tværs af alle jeres dokumenter" },
        { text: "Ubegrænset antal PDFs og sider" },
        { text: "Skræddersyet filstørrelse efter behov" },
        { text: "Dedikeret support" },
        { text: "Tilpassede løsninger" }
      ]}
      buttonText="Kontakt →"
      gradientBackground="bg-gradient-to-br from-white to-gray-100"
      borderColor="border border-gray-200"
      shadowClass="shadow-lg"
      comingSoon={true}
      onButtonClick={handleEnterpriseBtnClick}
    />
  ];

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div 
      ref={ref}
      className="bg-[rgb(245,245,247)] rounded-3xl p-4 sm:p-6 xl:p-8 w-full max-w-[1663px] mx-auto overflow-hidden"
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2
      }}
    >
      <motion.div 
        className="flex flex-col mb-6 xl:mb-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mb-4 xl:mb-6">
          <h2 className="text-2xl sm:text-3xl xl:text-5xl font-bold text-slate-950 tracking-[-0.04em]">
            Få mere ud af dine dokumenter.
          </h2>
          <p className="text-blue-600 text-2xl sm:text-3xl xl:text-5xl font-bold inline-block tracking-[-0.04em]">
            Simpel prissætning.
          </p>
        </div>
        <div className="mt-2">
          <ShimmerButtonDemo text="Prøv gratis" href="/dashboard" />
        </div>
      </motion.div>
      <motion.div 
        className="xl:hidden"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <PricingCardScroller cards={pricingCards} />
      </motion.div>
      <motion.div 
        className="hidden xl:grid xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {pricingCards}
      </motion.div>
    </motion.div>
  );
};

export default PricingComponent;