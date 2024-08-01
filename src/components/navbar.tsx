import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { MaxWidthWrapper } from "./max-width-wrapper";
import { MobileNav } from "./mobile-nav";
import { UserAccountNav } from "./user-account-nav";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all hidden sm:block">
        <MaxWidthWrapper>
          <div className="flex h-14 items-center justify-between border-b border-zinc-200">
            <Link href="/" className="flex z-40 font-bold">
              <span>lingvist</span><span className="text-blue-600">.</span>
            </Link>

            <div className="flex items-center justify-center space-x-4">
              {!user ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Priser
                  </Link>

                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Log ind
                  </LoginLink>
                  <RegisterLink
                    className={buttonVariants({
                      size: "sm",
                    })}
                  >
                    Kom i gang <ArrowRight className="ml-1.5 h-5 w-5" />
                  </RegisterLink>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Kontrolpanel
                  </Link>

                  <UserAccountNav
                    name={
                      !user.given_name || !user.family_name
                        ? "Your Account"
                        : `${user.given_name} ${user.family_name}`
                    }
                    email={user.email ?? ""}
                    imageUrl={user.picture ?? ""}
                  />
                </>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
      
      <MobileNav isAuth={!!user} />
    </>
  );
};
