import { PizzaIcon } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "lucide-react";
import React from "react";
import Button from "./ui/Button";

type Props = {};

function Footer({}: Props) {
  return (
    <div className="m-auto max-w-7xl min-h-max py-8 px-4 bg-slate-100/20 dark:bg-slate-900/75 backdrop-blur-md rounded-lg">
      <div className=" xl:px-0 w-full flex flex-col sm:flex-row gap-y-4 justify-between m-auto mt-4 text-gray-950 dark:text-slate-100 items-center ">
        <div className="flex gap-2 justify-evenly sm:hidden ">
          
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
          <Link
            href={
              "https://github.com/8rxn/infinitemeals/blob/main/CONTRIBUTING.md"
            }
            target="_blank"
            rel="noreferrer"
          >
            <Button variant={"ghost"} className="">
              Contribution Guide
            </Button>
          </Link>
        </div>
        <h1 className="font-bold text-xl font-mono ">
          Crafted with <span className="text-[#FF0B55]">♥</span> by{" "}
          <Link
            href="https://github.com/8rxn"
            rel="noreferrer"
            target="_blank"
            className="text-[#FF0B55] underline underline-offset-8 hover:backdrop-brightness-110 hover:bg-slate-100/10 inline-flex transition "
          >
            8rxn
            <GithubIcon className="ml-4" />
          </Link>
        </h1>
        <Link href="/">
          <h1 className="font-bold text-xl font-mono cursor-pointer  ">
            <span className="inline-block mr-2 -translate-y-[50%] ">
              <PizzaIcon />
            </span>
            <span className="inline-block hover:underline underline-offset-4">
              Infinite <br /> Meals
            </span>
          </h1>
        </Link>
        <div className="hidden gap-2 justify-evenly sm:flex items-center ">
         
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
          <Link
            href={
              "https://github.com/8rxn/infinitemeals/blob/main/CONTRIBUTING.md"
            }
            target="_blank"
            rel="noreferrer"
          >
            <Button variant={"ghost"} className="">
              Contribution Guide
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Footer;
