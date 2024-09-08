"use client"

import React, { useEffect, useRef, useState, useContext } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { cn } from '@/lib/utils';
import useClickOutside from '../hooks/useClickOutside';
import { Filter, Plus } from 'lucide-react';
import { ChatContext } from '../chat/chat-context';
import { toast } from 'sonner';

const POPUP_WIDTH = 300;

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
  content: ItemContent;
}

const ITEMS: Item[] = [
  {
    id: 1,
    label: 'Tematisk Filtrering',
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
  },
];

export default function ToolbarExpandable() {
  const {
    kontraktvilkaar, setKontraktvilkaar,
    okonomi, setOkonomi,
    metode, setMetode,
    risici, setRisici
  } = useContext(ChatContext);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  const handleToggle = (key: string) => {
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
  
    switch (key) {
      case 'kontraktvilkaar':
        setKontraktvilkaar(!kontraktvilkaar);
        showToast(kontraktvilkaar ? "Kontraktvilkår filtrering deaktiveret" : "Kontraktvilkår filtrering aktiveret");
        break;
      case 'okonomi':
        setOkonomi(!okonomi);
        showToast(okonomi ? "Økonomi filtrering deaktiveret" : "Økonomi filtrering aktiveret");
        break;
      case 'metode':
        setMetode(!metode);
        showToast(metode ? "Metode filtrering deaktiveret" : "Metode filtrering aktiveret");
        break;
      case 'risici':
        setRisici(!risici);
        showToast(risici ? "Risici filtrering deaktiveret" : "Risici filtrering aktiveret");
        break;
    }
  };

  const renderContent = (item: Item) => {
    return (
      <div className='space-y-2'>
        <div>
          <span className='text-sm font-medium text-zinc-800 mb-2 block'>{item.content.label}</span>
          {item.content.description && (
            <p className='text-xs text-zinc-500 mt-1 mb-3'>{item.content.description}</p>
          )}
        </div>
        {item.content.subItems && (
          <div className='space-y-3 ml-2 mt-2'>
            {item.content.subItems.map((subItem) => (
              <div key={subItem.key} className='flex items-center justify-between'>
                <span className='text-sm text-zinc-600'>{subItem.label}</span>
                <Toggle
                  isOn={
                    subItem.key === 'kontraktvilkaar' ? kontraktvilkaar :
                    subItem.key === 'okonomi' ? okonomi :
                    subItem.key === 'metode' ? metode :
                    subItem.key === 'risici' ? risici :
                    false
                  }
                  onToggle={() => handleToggle(subItem.key)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <MotionConfig transition={transition}>
      <div className="relative" ref={ref}>
        <button
          aria-label="Tematisk Filtrering"
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-zinc-950/10',
            isOpen && 'bg-blue-500 text-white hover:bg-blue-600'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <Filter className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
        <AnimatePresence initial={false} mode="wait">
          {isOpen && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 rounded-xl border border-zinc-950/10 bg-white shadow-lg overflow-hidden"
              style={{
                width: `${POPUP_WIDTH}px`,
              }}
            >
              <div className="p-4">
                {ITEMS.map((item) => renderContent(item))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}