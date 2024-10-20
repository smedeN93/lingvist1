import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TextEffect } from '@/components/ui/text_effect';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 mt-96">
      <div className="bg-gray-800 rounded-full p-3">
        <ArrowRight className="h-6 w-6 text-white" />
      </div>
      <TextEffect
        as="h3"
        className="font-semibold text-4xl text-gray-800"
        preset="fade"
        per="char"
      >
        Skal vi starte med en opsummering?
      </TextEffect>
      <TextEffect
        as="p"
        className="text-gray-700 text-center max-w-sm"
        preset="fade"
        per="char"
        delay={0.8}
      >
        Stil dit første spørgsmål for at komme i gang.
      </TextEffect>
    </div>
  );
};
