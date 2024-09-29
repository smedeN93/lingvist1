"use client"

import React, { Suspense } from "react";
import LandingPage from "@/components/ui/landing-page-aurora";
import ShuffleSection from "@/components/ui/ShuffleSection";
import Expandable from "@/components/ui/FeatureSection";
import { AppleCardsCarousel } from "@/components/ui/apple-cards-carousel";

const AnswerResponse = React.lazy(() => import("@/components/ui/AnswerResponse"));
const IntermediateCard = React.lazy(() => import("@/components/ui/IntermediateCard"));
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

      <div className="mt-24 md:mt-32 mb-24 md:mb-32 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingFallback />}>
          <AppleCardsCarousel />
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