"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="sm:hidden fixed top-4 left-4 right-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-full shadow-lg py-2 px-4 flex items-center justify-between border border-gray-200">
      <Link href="/" className="flex items-center font-bold text-sm">
  <span>lingvist</span>
  <span className="text-blue-600 text-lg font-extrabold leading-none relative bottom-0.5">.</span>
</Link>
        <Link href="/pricing" className="text-slate-950 text-sm font-semibold">
          Priser
        </Link>
        {!isAuth ? (
          <>
            <Link href="/sign-in" className="text-slate-950 text-sm font-semibold">
              Log ind
            </Link>
            <Link href="/sign-up" className="bg-slate-950 text-white text-sm font-medium py-2 px-4 rounded-full">
              Prøv gratis
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-slate-950 text-sm font-medium">
              Kontrolpanel
            </Link>
            <Link href="/sign-out" className="text-slate-950 text-sm font-medium">
              Log ud
            </Link>
          </>
        )}
      </div>
    </div>
  );
};