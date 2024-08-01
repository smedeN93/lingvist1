import React from 'react';
import { Sparkles, MessageCircle, TrendingUp, User } from 'lucide-react';

const PDFChatFlow = () => {
  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 600 160">
        {/* Connecting line */}
        <line x1="75" y1="80" x2="525" y2="80" stroke="#E2E8F0" strokeWidth="2" />

        {/* User Icon */}
        <circle cx="75" cy="80" r="40" fill="#ffffff" stroke="#E2E8F0" strokeWidth="2" />
        <foreignObject x="45" y="50" width="60" height="60">
          <div className="flex items-center justify-center w-full h-full">
            <User size={32} className="text-blue-600" />
          </div>
        </foreignObject>
        <text x="75" y="135" textAnchor="middle" className="text-lg font-medium fill-[#888888]">
          <tspan x="75" dy="0">Du uploader et</tspan>
          <tspan x="75" dy="1.2em">PDF-dokument</tspan>
        </text>

        {/* Step 2: AI Analysis */}
        <circle cx="225" cy="80" r="40" fill="#ffffff" stroke="#E2E8F0" strokeWidth="2" />
        <foreignObject x="195" y="50" width="60" height="60">
          <div className="flex items-center justify-center w-full h-full">
            <Sparkles size={32} className="text-blue-600" />
          </div>
        </foreignObject>
        <text x="225" y="135" textAnchor="middle" className="text-lg font-medium fill-[#888888]">
          <tspan x="225" dy="0">AI analyserer</tspan>
          <tspan x="225" dy="1.2em">PDF-indhold</tspan>
        </text>

        {/* Step 3: Chat */}
        <circle cx="375" cy="80" r="40" fill="#ffffff" stroke="#E2E8F0" strokeWidth="2" />
        <foreignObject x="345" y="50" width="60" height="60">
          <div className="flex items-center justify-center w-full h-full">
            <MessageCircle size={32} className="text-blue-600" />
          </div>
        </foreignObject>
        <text x="375" y="135" textAnchor="middle" className="text-lg font-medium fill-[#888888]">
          <tspan x="375" dy="0">Du stiller</tspan>
          <tspan x="375" dy="1.2em">spørgsmål</tspan>
        </text>

        {/* Step 4: Insights */}
        <circle cx="525" cy="80" r="40" fill="#ffffff" stroke="#E2E8F0" strokeWidth="2" />
        <foreignObject x="495" y="50" width="60" height="60">
          <div className="flex items-center justify-center w-full h-full">
            <TrendingUp size={32} className="text-blue-600" />
          </div>
        </foreignObject>
        <text x="525" y="135" textAnchor="middle" className="text-lg font-medium fill-[#888888]">
          <tspan x="525" dy="0">AI genererer</tspan>
          <tspan x="525" dy="1.2em">indsigter</tspan>
        </text>

        {/* Animated document icon */}
        <g transform="translate(-15, -15)">
          <path d="M0 0h30v30H0z" fill="none" />
          <path d="M17.5 2.5H7.5a2.5 2.5 0 0 0-2.5 2.5v20a2.5 2.5 0 0 0 2.5 2.5h15a2.5 2.5 0 0 0 2.5-2.5V10l-7.5-7.5zm-1.25 11.25H8.75v-2.5h7.5v2.5zm3.75 5H8.75v-2.5h11.25v2.5zm0 5H8.75v-2.5h11.25v2.5z" fill="#2563EB" />
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M75,80 C150,80 150,80 225,80 C300,80 300,80 375,80 C450,80 450,80 525,80"
            keyPoints="0;0.33;0.66;1"
            keyTimes="0;0.33;0.66;1"
            calcMode="linear"
          />
        </g>
      </svg>
    </div>
  );
};


export default PDFChatFlow;
