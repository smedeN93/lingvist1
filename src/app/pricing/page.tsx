import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Check, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UpgradeButton } from "@/components/upgrade-button";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";

const pricingItems = [
  {
    plan: "Gratis",
    quota: 10,
    features: [
      { text: "Svar baseret udelukkende på indholdet i dine dokumenter" },
      { text: "Begrænset til 10 PDFs/måned" },
      { text: "Maksimum 15 sider pr. PDF" },
      { text: "Op til 4 MB filstørrelse" },
      { text: "Basal e-mail support" },
    ],
  },
  {
    plan: "Pro",
    quota: PLANS.find((p) => p.slug === "pro")!.quota,
    features: [
      { text: "Dybdegående svar baseret på hele dokumentets kontekst" },
      { text: "Høj kvote på 50 PDFs/måned" },
      { text: "Helt op til 50 sider pr. PDF" },
      { text: "Omfattende 16 MB filstørrelse" },
      { text: "Prioriteret support med hurtig responstid" },
      { text: "Ubegrænset søgehistorik" },
    ],
  },
  {
    plan: "Enterprise",
    quota: "Ubegrænset",
    features: [
      { text: "AI trænet på jeres virksomhedsdata" },
      { text: "Indsigt på tværs af alle jeres dokumenter" },
      { text: "Ubegrænset antal PDFs og sider" },
      { text: "Skræddersyet filstørrelse efter behov" },
      { text: "Dedikeret support" },
      { text: "Tilpassede løsninger" },
    ],
  },
];

const StructuredGridBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Solid color background */}
      <div className="absolute inset-0 bg-[rgb(245,245,247)]" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-full max-w-[1800px] h-full relative"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(220,220,225,0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(220,220,225,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '150px 150px',
            backgroundPosition: 'center center',
            border: '1px solid rgba(220,220,225,0.8)',
          }}
        >
          {/* Top-left cross */}
          <div 
            className="absolute -top-[1.5px] -left-[1.5px]" 
            style={{
              width: '75px',
              height: '75px',
              borderTop: '2.5px solid rgba(210,210,215,1)',
              borderLeft: '1.5px solid rgba(210,210,215,1)',
            }}
          />
          {/* Top-right cross */}
          <div 
            className="absolute -top-[1.5px] -right-[1.5px]" 
            style={{
              width: '75px',
              height: '75px',
              borderTop: '2.5px solid rgba(210,210,215,1)',
              borderRight: '1.5px solid rgba(210,210,215,1)',
            }}
          />
          {/* Bottom-left cross */}
          <div 
            className="absolute -bottom-[1.5px] -left-[1.5px]" 
            style={{
              width: '75px',
              height: '75px',
              borderBottom: '1.5px solid rgba(210,210,215,1)',
              borderLeft: '1.5px solid rgba(210,210,215,1)',
            }}
          />
          {/* Bottom-right cross */}
          <div 
            className="absolute -bottom-[1.5px] -right-[1.5px]" 
            style={{
              width: '75px',
              height: '75px',
              borderBottom: '1.5px solid rgba(210,210,215,1)',
              borderRight: '1.5px solid rgba(210,210,215,1)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const PricingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <StructuredGridBackground />
      <div className="relative z-10 w-full min-h-screen overflow-auto pt-28 pb-24">
        <MaxWidthWrapper className="text-center">
          <div className="mx-auto mb-10 sm:max-w-lg opacity-0 animate-fade-in-up">
            <h1 className="text-6xl font-bold sm:text-7xl">Priser</h1>
            <p className="mt-5 text-gray-600 sm:text-lg">
              Vi hjæper dig med at få meget mere ud af dine dokumenter.
            </p>
          </div>
        </MaxWidthWrapper>

        {/* Removed the background color from this container */}
        <div className="rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-[1663px] mx-auto mt-8 mb-20 opacity-0 animate-fade-in-up-delay relative z-20">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            <TooltipProvider>
              {pricingItems.map(({ plan, features }, index) => {
                const price =
                  plan !== "Enterprise"
                    ? PLANS.find((p) => p.slug === plan.toLowerCase())?.price
                        ?.amount || 0
                    : null;

                return (
                  <div
                    key={plan}
                    className={cn(
                      "rounded-3xl p-6 lg:p-8 flex flex-col h-full relative xl:min-h-[300px] opacity-0 animate-fade-in-up",
                      {
                        "bg-gradient-to-br from-black to-gray-900 text-white": plan === "Pro",
                        "bg-gradient-to-br from-white to-gray-100": plan !== "Pro",
                        "border border-gray-200": plan !== "Pro",
                      },
                      "shadow-lg",
                      index === 0 ? "delay-200" : index === 1 ? "delay-300" : "delay-400"
                    )}
                  >
                    {plan === "Pro" && (
                      <div className="absolute top-3 right-3 bg-green-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_8px_rgba(255,255,255,0.3),0_2px_4px_rgba(255,255,255,0.2)]">
                        MEST POPULÆR
                      </div>
                    )}
                    {plan === "Enterprise" && (
                      <div className="absolute top-3 right-3 bg-slate-950 text-white text-xs font-bold px-3 py-1 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.25),0_2px_4px_rgba(0,0,0,0.15)]">
                        Kommer snart
                      </div>
                    )}

                    <h3 className={cn("text-xl md:text-2xl xl:text-3xl font-bold", {
                      "text-white": plan === "Pro",
                      "text-slate-950": plan !== "Pro",
                    })}>
                      {plan}
                    </h3>
                    <p className={cn("text-sm mt-2", {
                      "text-gray-300": plan === "Pro",
                      "text-gray-500": plan !== "Pro",
                    })}>
                    </p>
                    <div className="my-5">
                      <span className={cn("text-2xl md:text-3xl xl:text-4xl font-bold", {
                        "text-white": plan === "Pro",
                        "text-slate-950": plan !== "Pro",
                      })}>
                        {price !== null ? `${price.toFixed(2)} kr.` : "Kontakt os"}
                      </span>
                      {price !== null && (
                        <span className={cn("text-sm md:text-base", {
                          "text-gray-300": plan === "Pro",
                          "text-gray-500": plan !== "Pro",
                        })}>
                          {" "}
                          / måned
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 lg:space-y-4 mb-6 flex-grow">
                      {features.map((feature, i) => (
                        <li key={`${plan}-${i + 1}`} className="flex items-start">
                          <CheckCircle2
                            className={cn("w-4 h-4 xl:w-5 xl:h-5 mr-2 flex-shrink-0 mt-[0.2em]", {
                              "text-green-400": plan === "Pro",
                              "text-slate-950": plan !== "Pro",
                            })}
                          />
                          <span className={cn("text-sm xl:text-base", {
                            "text-white": plan === "Pro",
                            "text-slate-950": plan !== "Pro",
                          })}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      {plan === "Gratis" ? (
                        <Link
                          href={user ? "/dashboard" : "/sign-in"}
                          className={cn(
                            buttonVariants({
                              className: "w-full py-3 px-4 rounded-full font-bold text-sm xl:text-base",
                            }),
                            "bg-black text-white hover:bg-gray-800"
                          )}
                        >
                          {user ? "Kom i gang" : "Start nu"} →
                        </Link>
                      ) : plan === "Pro" ? (
                        user ? (
                          <UpgradeButton />
                        ) : (
                          <Link
                            href="/sign-in"
                            className={cn(
                              buttonVariants({
                                className: "w-full py-3 px-4 rounded-full font-bold text-sm xl:text-base",
                              }),
                              "bg-green-400 text-black hover:bg-green-500"
                            )}
                          >
                            Start nu →
                          </Link>
                        )
                      ) : (
                        <Link
                          href="mailto:lingvist@kontakt.dk"
                          className={cn(
                            buttonVariants({
                              className: "w-full py-3 px-4 rounded-full font-bold text-sm xl:text-base",
                            }),
                            "bg-black text-white hover:bg-gray-800"
                          )}
                        >
                          Kontakt →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;