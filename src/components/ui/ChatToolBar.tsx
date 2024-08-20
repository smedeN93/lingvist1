"use client"

import React, { useEffect, useRef, useState, useContext } from 'react';
import useMeasure from 'react-use-measure';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';
import useClickOutside from '../hooks/useClickOutside';
import { Book, FileSearch, Filter, GitBranch } from 'lucide-react';
import { ChatContext } from '../chat/chat-context';
import { toast } from 'sonner';

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.25,
};

interface ToggleProps {
  isOn: boolean;
  onToggle: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, onToggle }) => (
  <div
    className={`relative h-5 w-9 cursor-pointer rounded-full ${
      isOn ? 'bg-blue-500' : 'bg-gray-200'
    }`}
    onClick={onToggle}
  >
    <motion.div
      className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow"
      animate={{ x: isOn ? '16px' : '0px' }}
      transition={transition}
    />
  </div>
);

interface SubItem {
  label: string;
  key: string;
}

interface ItemContent {
  label: string;
  description?: string;
  subItems?: SubItem[];
}

interface Item {
  id: number;
  label: string;
  title: React.ReactNode;
  content: ItemContent;
  hasToggle: boolean;
}

const ITEMS: Item[] = [
  {
    id: 1,
    label: 'Inkludér sidetal',
    title: <Book className='h-5 w-5' />,
    content: {
      label: 'Inkludér sidetal',
      description: 'Vis sidetal for hver reference i svaret.',
    },
    hasToggle: true,
  },
  {
    id: 2,
    label: 'Argumentationsanalyse',
    title: <FileSearch className='h-5 w-5' />,
    content: {
      label: 'Argumentationsanalyse',
      description: 'Tilføj en analyse af argumenterne i teksten.',
    },
    hasToggle: true,
  },
  {
    id: 3,
    label: 'Tematisk Filtrering',
    title: <Filter className='h-5 w-5' />,
    content: {
      label: 'Tematisk Filtrering',
      description: 'Filtrer indholdet baseret på specifikke temaer.',
      subItems: [
        { label: 'Tjek Kontraktvilkår', key: 'kontraktvilkaar' },
        { label: 'Analysér Økonomi', key: 'okonomi' },
        { label: 'Gennemgå Metode', key: 'metode' },
        { label: 'Identificér Risici', key: 'risici' },
      ],
    },
    hasToggle: false,
  },
  {
    id: 4,
    label: 'Udforsk Scenarier',
    title: <GitBranch className='h-5 w-5' />,
    content: {
      label: 'Udforsk Scenarier',
      description: 'Generer forskellige scenarier baseret på indholdet.',
    },
    hasToggle: true,
  },
];

export default function ToolbarExpandable() {
  const {
    includePageNumbers, setIncludePageNumbers,
    argumentAnalysis, setArgumentAnalysis,
    exploreScenarios, setExploreScenarios,
    kontraktvilkaar, setKontraktvilkaar,
    okonomi, setOkonomi,
    metode, setMetode,
    risici, setRisici
  } = useContext(ChatContext);

  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  useEffect(() => {
    if (isFirstVisit) {
      setShowWelcomeMessage(true);
      setIsFirstVisit(false);

      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const [activeMainFunction, setActiveMainFunction] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [contentRef, { height: heightContent }] = useMeasure();
  const [menuRef, { width: widthContainer }] = useMeasure();
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [maxWidth, setMaxWidth] = useState(0);

  useClickOutside(ref, () => {
    setIsOpen(false);
    setActive(null);
  });

  useEffect(() => {
    if (!widthContainer || maxWidth > 0) return;
    setMaxWidth(widthContainer);
  }, [widthContainer, maxWidth]);

  const handleToggle = (key: string, itemId: number) => {
    const showToast = (message: string) => {
      toast.success(message, {
        position: "bottom-right",
        duration: 3000,
        style: {
          marginBottom: '250px',
          marginLeft: '20px',
        },
      });
    };
  
    if (itemId === 1) {
      // Sidetal toggle - kan aktiveres/deaktiveres uafhængigt
      const newState = !includePageNumbers;
      setIncludePageNumbers(newState);
      showToast(newState ? "Sidetal inkluderet" : "Sidetal ekskluderet");
      return;
    }
  
    // For andre hovedfunktioner
    // Deaktiver alle andre hovedfunktioner
    setArgumentAnalysis(false);
    setExploreScenarios(false);
    setKontraktvilkaar(false);
    setOkonomi(false);
    setMetode(false);
    setRisici(false);
  
    if (activeMainFunction === itemId) {
      // Hvis den aktive funktion klikkes, deaktiver den
      setActiveMainFunction(null);
      showToast(`${ITEMS.find(item => item.id === itemId)?.label} deaktiveret`);
    } else {
      // Aktiver den valgte funktion
      setActiveMainFunction(itemId);
      switch (itemId) {
        case 2:
          setArgumentAnalysis(true);
          showToast("Argumentationsanalyse aktiveret");
          break;
        case 4:
          setExploreScenarios(true);
          showToast("Udforsk scenarier aktiveret");
          break;
        case 3:
          // For tematisk filtrering, aktiver kun den valgte
          switch (key) {
            case 'kontraktvilkaar':
              setKontraktvilkaar(true);
              showToast("Kontraktvilkår filtrering aktiveret");
              break;
            case 'okonomi':
              setOkonomi(true);
              showToast("Økonomi filtrering aktiveret");
              break;
            case 'metode':
              setMetode(true);
              showToast("Metode filtrering aktiveret");
              break;
            case 'risici':
              setRisici(true);
              showToast("Risici filtrering aktiveret");
              break;
          }
          break;
      }
    }
  };

  const renderContent = (item: Item) => {
    return (
      <div className='space-y-2'>
        <div>
          <span className='text-sm font-medium text-zinc-800'>{item.content.label}</span>
          {item.content.description && (
            <p className='text-xs text-zinc-500 mt-1'>{item.content.description}</p>
          )}
        </div>
        {item.content.subItems && (
          <div className='space-y-1 ml-2 mt-1'>
            {item.content.subItems.map((subItem) => (
              <div key={subItem.key} className='flex items-center justify-between'>
                <span className='text-xs text-zinc-600'>{subItem.label}</span>
                <Toggle
                  isOn={
                    subItem.key === 'kontraktvilkaar' ? kontraktvilkaar :
                    subItem.key === 'okonomi' ? okonomi :
                    subItem.key === 'metode' ? metode :
                    subItem.key === 'risici' ? risici :
                    false
                  }
                  onToggle={() => handleToggle(subItem.key, item.id)}
                />
              </div>
            ))}
          </div>
        )}
        {item.hasToggle && (
          <div className='flex items-center justify-between'>
            <span className='text-xs text-zinc-600'>Aktivér</span>
            <Toggle
              isOn={
                item.id === 1 ? includePageNumbers :
                item.id === 2 ? argumentAnalysis :
                item.id === 4 ? exploreScenarios :
                false
              }
              onToggle={() => handleToggle(`main-${item.id}`, item.id)}
            />
          </div>
        )}
      </div>
    );
  };
  return (
    <MotionConfig transition={transition}>
      <div className="relative" ref={ref}>
        <AnimatePresence>
          {showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-blue-100 text-blue-800 rounded-lg shadow-md"
            >
              <p className="text-sm font-medium">Velkommen til! 👋</p>
              <p className="text-xs mt-1">Prøv vores toolbar for yderligere funktioner.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="rounded-xl border border-zinc-950/10 bg-white">
          <div className="flex space-x-2 p-2" ref={menuRef}>
            {ITEMS.map((item) => (
              <button
                key={item.id}
                aria-label={item.label}
                className={cn(
                  'relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98]',
                  active === item.id ? 'bg-zinc-100 text-zinc-800' : ''
                )}
                type="button"
                onClick={() => {
                  if (!isOpen) setIsOpen(true);
                  if (active === item.id) {
                    setIsOpen(false);
                    setActive(null);
                    return;
                  }
                  setActive(item.id);
                  setShowWelcomeMessage(false); // Skjul velkomstbeskeden ved interaktion
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence initial={false} mode="sync">
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full right-0 mb-2 rounded-xl border border-zinc-950/10 bg-white shadow-lg overflow-hidden"
              style={{
                width: maxWidth,
              }}
            >
              <div ref={contentRef} className="p-3">
                {ITEMS.map((item) => {
                  const isSelected = active === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isSelected ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        className={cn(
                          'space-y-2',
                          isSelected ? 'block' : 'hidden'
                        )}
                      >
                        {renderContent(item)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}