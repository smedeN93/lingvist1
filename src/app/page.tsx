"use client"

import React, { Suspense } from "react";
import LandingPage from "@/components/ui/landing-page-aurora";
import ShuffleSection from "@/components/ui/ShuffleSection";
import Expandable from "@/components/ui/expandableimagescard";


const AnswerResponse = React.lazy(() => import("@/components/ui/AnswerResponse"));
const IntermediateCard = React.lazy(() => import("@/components/ui/IntermediateCard"));
const FeatureSection = React.lazy(() => import("@/components/ui/FeatureSection").then(module => ({ default: module.FeatureSection })));
const SecurityInfoCard = React.lazy(() => import("@/components/ui/SecurityInfoCard"));
const PricingComponent = React.lazy(() => import("@/components/ui/PricingComponent"));
const PreFooter = React.lazy(() => import("@/components/ui/PreFooter"));


const LoadingFallback = () => <div className="w-full h-20 flex items-center justify-center">Loading...</div>;

const HomePage = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="pb-2 sm:pb-8 md:pb-24 lg:pb-16">
        <LandingPage />
      </div>

      <div className="min-h-screen flex items-center justify-center">
        <Suspense fallback={<LoadingFallback />}>
          <AnswerResponse />
        </Suspense>
      </div>
      
      <div className="pt-16 sm:pt-2 md:pt-32 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <ShuffleSection />
        </Suspense>
      </div>

      <div className="pt-16 sm:pt-2 md:pt-32 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <Expandable />
      </div>
      <div className="pt-16 sm:pt-2 md:pt-32 pb-16 sm:pb-24 md:pb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <IntermediateCard
            title="Dine dokumenter, forbedret."
            animatedTexts={[
              "Tal med dem.",
              "Tag noter.",
              "Opsummer dem.",
              "Få præcise svar.",
              "Sammensæt tekster.",
              "Lingvist. Start nu."
            ]}
            buttonText="Prøv gratis"
            buttonHref="/demo"
            descriptionText="Du har sikkert prøvet det: At finde nålen i høstakken.
              Men forestil dig, hvis dine dokumenter kunne svare dig.
              Med Lingvist bliver din søgen til en samtale.
              Stil et spørgsmål. Få præcise svar. Direkte fra dine dokumenter."
          />
        </Suspense>
      </div>

      <div className="-mt-16 sm:-mt-20 md:-mt-24 lg:-mt-10">
        <Suspense fallback={<LoadingFallback />}>
          <FeatureSection 
            title="En verden af muligheder."
            subtitle="Med rigtig meget potentiale."
            goodAt="GPT-4o"
            images={[
              {
                image: '/lingvist_chat_preview10.webp',
                category: 'Indsigter',
                description: 'Find de nøgletal og informationer du mangler.',
              },
              {
                image: '/lingvist_chat_preview11.webp',
                category: 'Produktivitet',
                description: 'Få svar baseret kun på dit dokument.',
              },
              {
                image: '/lingvist_chat_preview1.webp',
                category: 'Dokumentanalyse',
                description: 'Opsummering og syntese af dine nøgleinformationer.',
              },
              {
                image: '/lingvist_chat_preview8.webp',
                category: 'Problemløsning',
                description: 'Komplekse udfordringer. Få løsninger.',
              },
              {
                image: '/lingvist_chat_preview5.webp',
                category: 'Vidensudtræk',
                description: 'Destillér kritiske krav og information.',
              },
              {
                image: '/lingvist_chat_preview12.webp',
                category: 'Tekstanalyse',
                description: 'Opfang essensen og konteksten.',
              },
            ]}
          />
        </Suspense>
      </div>

      <div className="mt-24 md:mt-32 mb-24 md:mb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <SecurityInfoCard />
        </Suspense>
      </div>

      <div className="mt-24 md:mt-32 mb-24 md:mb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <PricingComponent />
        </Suspense>
      </div>

      <div className="mt-24 md:mt-32 mb-24 md:mb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <PreFooter />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;