'use client'

import { useState, useEffect } from 'react';

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`sticky h-14 inset-x-0 top-0 z-30 w-full transition-all hidden sm:block
                     bg-[rgb(245,245,247)]
                     ${isScrolled ? 'backdrop-blur-lg border-b border-gray-200' : ''}`}>
      {children}
    </nav>
  );
};