"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 overflow-hidden">
        <div
  className={cn(
    `
    [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
    [background-image:var(--aurora)]
    [background-size:200%]
    [background-position:50%_50%]
    filter blur-[10px]
    after:content-[""] after:absolute after:inset-0 after:[background-image:var(--aurora)]
    after:[background-size:200%] 
    after:animate-aurora after:[background-attachment:fixed]
    pointer-events-none
    absolute -inset-[10px] opacity-50
    will-change-transform
    transform translateZ(0)`,
    showRadialGradient &&
      `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
  )}
></div>
        </div>
        {/* Add fade-to-white overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
        {children}
      </div>
    </main>
  );
};