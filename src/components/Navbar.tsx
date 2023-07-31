import { authOptions } from "@/server/auth";
import ThemeToggle from "./ThemeToggle";
import Button from "./ui/Button";
import { PizzaIcon, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import SignInButton from "./ui/SignInButton";
import SignOutButton from "./ui/SignOutButton";
import Link from "next/link";
import HiddenNav from "./HiddenNav";

const Navbar = async () => {
  const user = await getServerSession(authOptions);
  return (
    <div className="fixed top-0 w-screen overflow-x-hidden backdrop-blur-md z-20 ">
      <div className="max-w-7xl px-4 xl:px-0 w-full flex flex-wrap justify-between m-auto mt-4 text-gray-950 dark:text-slate-100 items-center ">
        <Link href="/">
          <h1 className="font-bold text-xl font-mono cursor-pointer hover:shadow-lg shadow-[#D61D4E] ">
            <span className="inline-block mr-2 -translate-y-[50%] ">
              <PizzaIcon />
            </span>
            <span className="inline-block hover:underline underline-offset-4">
              Infinite <br /> Meals
            </span>
          </h1>
        </Link>
        <div className="sm:flex gap-2 justify-evenly hidden">
          <ThemeToggle />
          <Link href={"/documentation"}>
            <Button variant={"ghost"} className="">
              Documentation
            </Button>
          </Link>
          <Link href={"/features"}>
            <Button variant={"ghost"} className="">
              Features
            </Button>
          </Link>
          <Link href={"/recipes"}>
            <Button variant={"ghost"} className="">
              All Recipes
            </Button>
          </Link>
          <Link href={"/categories"}>
            <Button variant={"ghost"} className="">
              Categories
            </Button>
          </Link>
          {user ? (
            <>
              <Link href={"/dashboard"}>
                <Button variant={"ghost"} className="">
                  <Search />
                </Button>
              </Link>
              
              <SignOutButton>Sign Out</SignOutButton>
            </>
          ) : (
            <SignInButton>Sign In</SignInButton>
          )}
        </div>
        <HiddenNav className="sm:hidden block"/>
      </div>
    </div>
  );
};

export default Navbar;
