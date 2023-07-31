"use client";

import { cn } from "@/lib/utils";
import Hamburger from "hamburger-react";
import Link from "next/link";
import { useState } from "react";
import Button from "./ui/Button";
import ThemeToggle from "./ThemeToggle";
import { useSession } from "next-auth/react";
import SignInButton from "./ui/SignInButton";
import SignOutButton from "./ui/SignOutButton";
import { Search } from "lucide-react";

type Props = {
  className?: string;
};

const HiddenNav = (props: Props) => {
  const [navbar, setNavbar] = useState(false);
  const { status } = useSession();
  return (
    <>
      <span className={`flex gap-4 items-center justify-end sm:hidden `}>
        <ThemeToggle />
        <Hamburger
          toggled={navbar}
          toggle={() => setNavbar(!navbar)}
          duration={0.5}
        />
      </span>
      <div
        className={cn(
          props.className,
          `flex flex-col gap-1  w-screen m-auto ${
            navbar
              ? "translate-y-0 h-fit py-4 "
              : "-translate-y-[100vh] h-0"
          } rounded-lg 
           transition `
        )}
      >
          <Link href={"/documentation"}>
            <Button variant={"ghost"} className="w-fit m-auto">
              Documentation
            </Button>
          </Link>
          <Link href={"/features"}>
            <Button variant={"ghost"} className="w-fit m-auto">
              Features
            </Button>
          </Link>
          <Link href={"/recipes"}>
            <Button variant={"ghost"} className="w-fit m-auto">
              All Recipes
            </Button>
          </Link>
          <Link href={"/categories"}>
            <Button variant={"ghost"} className="w-fit m-auto">
              Categories
            </Button>
          </Link>
            {status === "authenticated" ? (
              <>
                <Link href={"/dashboard"}>
                  <Button variant={"ghost"} className="w-fit m-auto flex gap-2">
                    Search <Search/>
                  </Button>
                </Link>
                <SignOutButton className="w-fit m-auto flex gap-2">Sign Out</SignOutButton>
              </>
            ) : (
              <SignInButton className="w-fit m-auto flex gap-2">Sign In</SignInButton>
            )}
      </div>
    </>
  );
};

export default HiddenNav;
