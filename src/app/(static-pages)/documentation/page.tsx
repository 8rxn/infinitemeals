import Guide from "@/components/docs/Guide";
import Intro from "@/components/docs/Intro";
import RoutesInfo from "@/components/docs/RoutesInfo";
import Steps from "@/components/docs/Steps";
import Tech from "@/components/docs/Tech";
import Button from "@/components/ui/Button";
import { Twitter } from "lucide-react";
import { Metadata } from "next";
import React from "react";
import Balancer from "react-wrap-balancer";

export const metadata: Metadata = {
  title: "Documentation | InfiniteMeals",
  description:
    "The Documentation on how to use InfiniteMeals. Also included the inner workings of the app.",
};

const Documentation = () => {
  return (
    <div className="flex flex-col 2xl:flex-row flex-wrap gap-8  justify-between mb-8 bg-slate-100 dark:bg-slate-900 p-8 sm:p-12 rounded-xl shadow-lg max-[500px]:pt-16 z-20 relative">
      <Intro />
      <Guide />
      <Steps />
      <Tech />
      <RoutesInfo />
      <div className="flex flex-col items-center">
        <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300 mb-4">
          <Balancer className="italic">Bon Appetit!</Balancer>
        </p>
        <a
          href={`https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0A%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5`}
          rel="noreferrer"
          target="_blank"
        >
          <Button size={"lg"}>
            {" "}
            Spread Love{" "}
            <span className="ml-6">
              <Twitter />
            </span>{" "}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Documentation;
