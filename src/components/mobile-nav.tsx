"use client";

import { ArrowRight, Menu, X, Home, DollarSign, LogIn, LogOut } from "lucide-react";
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
      <div className="bg-white rounded-full shadow-lg py-2 px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-sm">
          <span>lingvist</span><span className="text-blue-600">.</span>
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
            <Link href="/dashboard" className="text-gray-700 text-sm font-medium">
              Kontrolpanel
            </Link>
            <Link href="/sign-out" className="text-gray-700 text-sm font-medium">
              Log ud
            </Link>
          </>
        )}
      </div>
    </div>
  );
};