"use client";
import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  IconX,
} from "@tabler/icons-react";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image, { ImageProps } from "next/image";
import useClickOutside from "@/components/hooks/useClickOutside";

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

type Card = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
};

export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto py-10 md:py-20 scroll-smooth [scrollbar-width:none]"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div className="flex flex-row justify-start gap-4 pl-[max(16px,calc((100%-1663px)/2+16px))]">
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="last:pr-[5%] md:last:pr-[33%] rounded-3xl"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="max-w-[1663px] mx-auto px-4 sm:px-6">
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="relative z-40 h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center disabled:opacity-50"
              onClick={scrollLeft}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              className="relative z-40 h-10 w-10 rounded-full bg-slate-950 flex items-center justify-center disabled:opacity-50"
              onClick={scrollRight}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false,
}: {
  card: Card;
  index: number;
  layout?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  const handleClose = useCallback(() => {
    setOpen(false);
    onCardClose(index);
  }, [setOpen, onCardClose, index]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  useClickOutside(containerRef, () => handleClose());

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 h-screen z-50 overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/80 backdrop-blur-lg h-full w-full fixed inset-0"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="max-w-5xl mx-auto bg-white dark:bg-neutral-900 h-fit  z-[60] my-10 p-4 md:p-10 rounded-3xl font-sans relative"
            >
              <button
                className="sticky top-4 h-8 w-8 right-0 ml-auto bg-black dark:bg-white rounded-full flex items-center justify-center"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white"
              >
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white"
              >
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="rounded-3xl bg-gray-100 dark:bg-neutral-900 h-80 w-56 md:h-[45rem] md:w-96 overflow-hidden flex flex-col items-start justify-start relative z-10"
      >
        <div className="absolute h-full top-0 inset-x-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-30 pointer-events-none" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.category}` : undefined}
            className="text-white text-sm md:text-base font-medium font-sans text-left"
          >
            {card.category}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.title}` : undefined}
            className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
          >
            {card.title}
          </motion.p>
        </div>
        <BlurImage
          src={card.src}
          alt={card.title}
          fill
          className="object-cover absolute z-10 inset-0"
        />
      </motion.button>
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        "transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      blurDataURL={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest}
    />
  );
};

const Content = ({ content, imageSrc }: { content: React.ReactNode, imageSrc: string }) => {
  return (
    <div className="bg-[#F5F5F7] p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        {content}
      </p>
      <Image
        src={imageSrc}
        alt="Lingvist feature illustration"
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
      />
    </div>
  );
};

export function AppleCardsCarousel() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} layout={true} />
  ));
 
  return (
    <div className="w-full h-full py-20">
      <div className="max-w-[1663px] mx-auto px-4 sm:px-6 mb-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-950 dark:text-neutral-200">
          Hvad kan du gøre med Lingvist?
        </h2>
      </div>
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    category: "Artificial Intelligence",
    title: "Find alle detaljerne med AI.",
    src: "https://images.unsplash.com/photo-1591951425600-d09958978584?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Udnyt kraften i AI til at afdække skjulte detaljer.</span>
          {" "}Lingvist&apos;s værktøjer hjælper dig med at analysere tekster dybere, opdage mønstre og få indsigt, du ellers kunne have overset. Perfekt til både akademisk forskning og professionel analyse.
        </>
      }
      imageSrc="/ai-analysis.webp"
    />,
  },
  {
    category: "Produktivitet",
    title: "Forbedr din produktivitet.",
    src: "https://images.unsplash.com/photo-1713640776184-f0430f43677b?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Boost din produktivitet.</span>
          {" "}Lingvist gør at du finder det du leder efter hurtigere, så du kan nå mere. Fra organisering af noter til hurtig søgning i dine dokumenter, kan du opleve en forbedring i din daglige effektivitet.
        </>
      }
      imageSrc="/productivity-tools.webp"
    />,
  },
  {
    category: "Arbejdsflow",
    title: "Zone hurtigere ind i materialet.",
    src: "https://images.unsplash.com/photo-1462622437620-30b99c08d621?q=80&w=3774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Opnå den flowtilstand som du har brug for.</span>
          {" "}Lingvist&apos;s hjælper dig med hurtigere at komme ind til kernen i dit materiale. Ved at søge kontekstbaseret i dine dokmenter, får du hurtigt det du har brug for.
        </>
      }
      imageSrc="/workflow-optimization.webp"
    />,
  },
  {
    category: "Fokus",
    title: "Få skærpet dit fokus med det samme.",
    src: "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Maksimer koncentration og fokus.</span>
          {" "}Der er mange distraktioner - generelt set. Det kræver typisk tid at komme helt ind i en ægte fokustilstand. Lingvist kan hjælpe med at få dig i gang.
        </>
      }
      imageSrc="/focus-mode.webp"
    />,
  },
  {
    category: "Tidsbesparelse",
    title: "Opnå meget mere.",
    src: "https://images.unsplash.com/photo-1516409590654-e8d51fc2d25c?q=80&w=2996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Gør mere på kortere tid.</span>
          {" "}Ved hurtigere at finde det du søger, kan du spare værdifuld tid. Fra hurtig informationssøgning med citationer og referencer, kan du fokusere på det væsentlige og opnå mere i din arbejdsdag.
        </>
      }
      imageSrc="/time-saving.webp"
    />,
  },
  {
    category: "Effektivitet",
    title: "Brug din dag bedre.",
    src: "https://images.unsplash.com/photo-1609577737527-88db9860c777?q=80&w=3221&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content: <Content 
      content={
        <>
          <span className="font-bold text-neutral-700">Optimering af de arbejdsopgaver der kræver mest tid.</span>
          {" "}Arbejdet med lange dokumenter tager tid. Ved at søge kontekstbaseret i dine dokumenter, kan du hurtigt finde det du har brug for.
        </>
      }
      imageSrc="/daily-optimization.webp"
    />,
  },
];