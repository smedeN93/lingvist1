import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import type { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import { extractRouterConfig } from "uploadthing/server";
import "react-loading-skeleton/dist/skeleton.css";
import "simplebar-react/dist/simplebar.min.css";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { cn, constructMetadata } from "@/lib/utils";
import Footer from "@/components/ui/Footer";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = constructMetadata();

export const viewport: Viewport = {
  themeColor: "#FFF",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <Providers>
        <body
          className={cn(
            "min-h-screen antialiased grainy flex flex-col",
            inter.className,
            "font-sans"
          )}
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          <Toaster richColors />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </Providers>
    </html>
  );
}