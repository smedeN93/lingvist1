import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SuggestionCardsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  "Hvilken tekst er mest relevant for",
  "Sammenlign indholdet af",
  "Forklar konceptet",
  "Find nøgleord i",
];

export const SuggestionCards: React.FC<SuggestionCardsProps> = ({ onSuggestionClick }) => {
  return (
    <div className="flex flex-wrap justify-center gap-0.5 mt-2">
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[rgb(250,250,252)] text-gray-800 text-xs font-light py-1 px-3.5 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex items-center"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}...
          <div className="bg-gray-800 rounded-full p-1 ml-2">
            <ArrowRight className="h-3 w-3 text-white" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};
