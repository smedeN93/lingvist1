"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode, useMemo } from "react";

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
  const auroraClasses = useMemo(() => {
    return cn(
      `absolute inset-0 overflow-hidden`,
      `[--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]`,
      `[--gradient-light:repeating-linear-gradient(100deg,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.8)_7%,transparent_10%,transparent_12%,rgba(255,255,255,0.8)_16%)]`,
      `[--gradient-dark:repeating-linear-gradient(100deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.8)_7%,transparent_10%,transparent_12%,rgba(0,0,0,0.8)_16%)]`,
      `before:content-[""] before:absolute before:inset-0`,
      `before:[background-image:var(--gradient-light),var(--aurora)]`,
      `before:dark:[background-image:var(--gradient-dark),var(--aurora)]`,
      `before:[background-size:300%,_200%]`,
      `before:[background-position:50%_50%,50%_50%]`,
      `before:opacity-70 before:animate-aurora before:[background-attachment:fixed]`,
      `after:content-[""] after:absolute after:inset-0`,
      `after:[background-image:var(--gradient-light),var(--aurora)]`,
      `after:dark:[background-image:var(--gradient-dark),var(--aurora)]`,
      `after:[background-size:200%,_100%]`,
      `after:opacity-50 after:animate-aurora after:[background-attachment:fixed] after:mix-blend-overlay`,
      `[filter:blur(1px)]`,
      showRadialGradient &&
        `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
    );
  }, [showRadialGradient]);

  return (
    <main>
      <div
        className={cn(
          "relative flex flex-col min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
          className
        )}
        {...props}
      >
        <div className={auroraClasses}></div>
        <div className="absolute inset-0 bg-white opacity-10 dark:bg-black dark:opacity-10"></div>
        {/* Fade-to-white overlay */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-zinc-900 pointer-events-none"></div>
        {children}
      </div>
    </main>
  );
};