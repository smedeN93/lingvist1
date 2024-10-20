"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  return (
    <div className="sm:hidden fixed top-4 left-4 right-4 z-50">
      <nav className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg px-4 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex font-bold items-center">
            <span className="text-slate-800 text-shadow-sm">lingvist</span>
            <span className="text-blue-600 text-2xl font-extrabold leading-none relative bottom-0.5 text-shadow-sm">.</span>
          </Link>

          <div className="flex items-center space-x-2">
            {!isAuth ? (
              <>
                <Link
                  href="/pricing"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                  )}
                >
                  Priser
                </Link>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                  )}
                >
                  Log ind
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({
                      size: "sm",
                    }),
                    "bg-white/40 text-slate-800 hover:bg-white/50 hover:text-slate-900 transition-colors text-shadow-sm"
                  )}
                >
                  Prøv gratis
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                  )}
                >
                  Kontrolpanel
                </Link>
                <Link
                  href="/sign-out"
                  className={cn(
                    buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    }),
                    "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                  )}
                >
                  Log ud
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
