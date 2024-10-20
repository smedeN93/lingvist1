"use client";

import { format } from "date-fns";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { getUserSubscriptionPlan } from "@/lib/stripe";

import { MaxWidthWrapper } from "./max-width-wrapper";
import { AuroraBackground } from "@/components/ui/aurora-background";

type BillingFormProps = {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
};

export const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { mutate: createStripeSession, isPending } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        else
          toast.error("Der opstod et problem..", {
            description: "Prøv igen senere.",
          });
      },
    });
  return (
    <AuroraBackground>
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[rgb(245,245,247)]">
        <MaxWidthWrapper className="max-w-2xl w-full">
          <Card className="bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-200 -mt-52">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold text-slate-950 mb-1">Abonnement</CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Administrer dit abonnement og betalinger
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-slate-950">Status</span>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  subscriptionPlan.isSubscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {subscriptionPlan.isSubscribed ? 'Aktiv' : 'Inaktiv'}
                </div>
              </div>
              <div className="mb-6">
                <span className="text-lg font-semibold text-slate-950">Professionel</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle2 className="text-blue-500 mr-3 h-5 w-5" />
                  <span className="text-sm text-gray-600">Dybdegående svar baseret på hele dokumentets kontekst</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-blue-500 mr-3 h-5 w-5" />
                  <span className="text-sm text-gray-600">Fuld adgang til alle funktioner</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="text-blue-500 mr-3 h-5 w-5" />
                  <span className="text-sm text-gray-600">Udvidet dokumentgrænse</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-gray-50 flex flex-col items-stretch space-y-4">
              <Button
                disabled={isPending}
                aria-disabled={isPending}
                onClick={(e) => {
                  e.preventDefault();
                  createStripeSession();
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {subscriptionPlan.isSubscribed
                  ? "Administrer Abonnement"
                  : "Opgradér til Pro"}
              </Button>
              {subscriptionPlan.isSubscribed && (
                <p className="text-xs text-center text-gray-500">
                  {subscriptionPlan.isCanceled
                    ? "Din plan vil blive annulleret den "
                    : "Din plan fornyes den "}
                  <span className="font-medium">
                    {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
                  </span>
                </p>
              )}
            </CardFooter>
          </Card>
        </MaxWidthWrapper>
      </div>
    </AuroraBackground>
  );
};