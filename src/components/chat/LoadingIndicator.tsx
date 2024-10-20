"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from 'lucide-react'

type LoadingStep = {
  label: string
  status: 'pending' | 'active' | 'completed'
}

interface LoadingIndicatorProps {
  steps: LoadingStep[]
}

export default function LoadingIndicator({ steps }: LoadingIndicatorProps) {
  return (
    <div className="mt-6 p-6 bg-[rgb(250,250,252)] rounded-3xl shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="flex flex-row items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Step Circle */}
            <div className="relative flex flex-col items-center">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300
                  ${
                    step.status === 'completed'
                      ? 'bg-blue-500'
                      : step.status === 'active'
                      ? 'bg-blue-400'
                      : 'bg-gray-200'
                  }`}
                animate={
                  step.status === 'active'
                    ? { scale: [1, 1.05, 1], opacity: [1, 0.9, 1] }
                    : {}
                }
                transition={{
                  duration: 1.2,
                  repeat: step.status === 'active' ? Infinity : 0,
                  repeatType: 'reverse',
                }}
              >
                {step.status === 'completed' ? (
                  <CheckIcon className="w-6 h-6" />
                ) : (
                  <span className={`font-semibold text-lg ${step.status === 'pending' ? 'text-gray-400' : ''}`}>
                    {index + 1}
                  </span>
                )}
              </motion.div>
              {/* Step Label */}
              <div className="mt-2 text-sm text-center w-32 text-gray-500 font-medium">
                {step.label}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="relative h-0.5 w-16 bg-gray-200 mx-2">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-blue-400"
                  initial={{ width: '0%' }}
                  animate={{
                    width:
                      step.status === 'completed' ||
                      steps[index + 1].status !== 'pending'
                        ? '100%'
                        : '0%',
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}