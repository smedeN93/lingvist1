import React from 'react';
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import ShimmerButton from './shimmer-button';

interface ShimmerRegisterLinkProps {
  orgCode?: string;
  postLoginRedirectURL?: string;
  authUrlParams?: { [key: string]: string };
  className?: string;
  children?: React.ReactNode;
  size?: 'default' | 'sm' | 'lg';
}

export const ShimmerRegisterLink: React.FC<ShimmerRegisterLinkProps> = ({
  orgCode,
  postLoginRedirectURL,
  authUrlParams,
  className,
  children = "Start gratis",
  size = 'default',
}) => {
  const sizeClasses = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 py-2 text-sm",
    lg: "h-11 px-8 py-2 text-sm",
  };

  const arrowSizes = {
    default: "h-4 w-4",
    sm: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <RegisterLink
      orgCode={orgCode}
      postLoginRedirectURL={postLoginRedirectURL}
      authUrlParams={authUrlParams}
    >
      <ShimmerButton className={`${sizeClasses[size]} ${className}`}>
        <span className="flex items-center justify-center whitespace-nowrap font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10">
          {children}
          <ArrowRight className={`ml-2 flex-shrink-0 ${arrowSizes[size]}`} />
        </span>
      </ShimmerButton>
    </RegisterLink>
  );
};