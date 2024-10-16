import React from 'react';
import { motion } from 'framer-motion';

type LoadingStep = {
  label: string;
  status: 'pending' | 'active' | 'completed';
};

interface LoadingIndicatorProps {
  steps: LoadingStep[];
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ steps }) => {
  return (
    <div className="flex flex-col items-center mt-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center my-2">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white
                ${step.status === 'completed' ? 'bg-green-500' :
                step.status === 'active' ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            animate={{
              scale: step.status === 'active' ? [1, 1.2, 1] : 1,
              rotate: step.status === 'completed' ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {step.status === 'completed' ? '✓' : index + 1}
          </motion.div>
          <div className="ml-4">
            <div className="text-sm font-medium">{step.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
