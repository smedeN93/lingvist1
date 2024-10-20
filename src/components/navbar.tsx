import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { MobileNav } from "./mobile-nav";
import { UserAccountNav } from "./user-account-nav";
import { ShimmerRegisterLink } from "./ui/ShimmerRegisterLink";
import { cn } from "@/lib/utils";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <div className="hidden sm:block fixed top-4 left-0 right-0 z-50">
        <MaxWidthWrapper>
          <nav className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg px-4 py-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex font-bold items-center">
                <span className="text-slate-800 text-shadow-sm">lingvist</span>
                <span className="text-blue-600 text-2xl font-extrabold leading-none relative bottom-0.5 text-shadow-sm">.</span>
              </Link>

              <div className="flex items-center space-x-2">
                {!user ? (
                  <>
                    <Link
                      href="/pricing"
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        }),
                        "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                      )}
                    >
                      Priser
                    </Link>

                    <LoginLink
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        }),
                        "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                      )}
                    >
                      Log ind
                    </LoginLink>
                    <ShimmerRegisterLink 
                      size="sm" 
                      className="bg-white/40 text-slate-800 hover:bg-white/50 hover:text-slate-900 transition-colors text-shadow-sm" 
                    />
                  </>
                ) : (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        }),
                        "bg-slate-200/50 text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 transition-colors text-shadow-sm"
                      )}
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
          </nav>
        </MaxWidthWrapper>
      </div>
      
      <MobileNav isAuth={!!user} />
    </>
  );
};
