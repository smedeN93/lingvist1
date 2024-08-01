"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/app/_trpc/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHECKOUT_TOAST_ID = "checkout-toast";

export const UpgradeButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      window.location.href = url ?? "/dashboard/billing";
    },
    onSettled: () => setIsLoading(false),
  });

  const handleClick = () => {
    setIsLoading(true);
    toast.loading("Omdirigerer...", {
      description: "Vent venligst mens du omdirigeres til kassen...",
      id: CHECKOUT_TOAST_ID,
    });

    createStripeSession();
  };

  useEffect(() => {
    if (!isLoading) toast.dismiss(CHECKOUT_TOAST_ID);
  }, [isLoading]);

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-disabled={isLoading}
      className={cn(
        buttonVariants({
          className:
            "w-full py-3 px-4 rounded-full font-bold text-sm lg:text-base",
        }),
        "bg-green-400 text-black hover:bg-green-500"
      )}
    >
      {isLoading ? "Omdirigerer..." : "Opgrader nu"}{" "}
      <ArrowRight className="h-5 w-5 ml-1.5" />
    </button>
  );
};