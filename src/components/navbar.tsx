import {
  LoginLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

import { MaxWidthWrapper } from "./max-width-wrapper";
import { MobileNav } from "./mobile-nav";
import { UserAccountNav } from "./user-account-nav";
import { NavbarWrapper } from "./navbarwrapper";
import { ShimmerRegisterLink } from "./ui/ShimmerRegisterLink";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <NavbarWrapper>
        <MaxWidthWrapper>
          <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex z-40 font-bold items-center">
  <span>lingvist</span>
  <span className="text-blue-600 text-2xl font-extrabold leading-none relative bottom-0.5">.</span>
</Link>

            <div className="flex items-center justify-center space-x-4">
              {!user ? (
                <>
                  <Link
                    href="/pricing"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "default",
                    })}
                  >
                    Priser
                  </Link>

                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "default",
                    })}
                  >
                    Log ind
                  </LoginLink>
                  <ShimmerRegisterLink size="default" className="shadow-md" />
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
      </NavbarWrapper>
      
      <MobileNav isAuth={!!user} />
    </>
  );
};