import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";


export const metadata: Metadata = {
  title: "Features | InfiniteMeals",
  description: "InfiniteMeals offers multiple features to the user of the application. Find out more here.",
};

const Features = () => {
  return (
    <div className="flex flex-col 2xl:flex-row flex-wrap gap-8  justify-between mb-8">
      <Card src={"/burger.webp"} alt={"Burger"} href="/dashboard">
        {" "}
        Get any recipe you&apos;d like to cook
        <br />
        <br /> Be it Indian, Italian or even out of this world *
        <br /> <br />
        We have it all <br />
        <br />
        <span className="text-xs text-[#FF0B55]">
          {" "}
          * As long as Text Davinci&apos;s training model had it.{" "}
        </span>
      </Card>

      <Card src="/soup.png" alt={"Soup"} href="/categories">
        {" "}
        Find recipes by Tags, Category, <br /> Ingredients, Cuisine, and more{" "}
        <br />
        <br /> If we don&apos;t already have it,
        <br /> we&apos;ll find and add it to our database <br />
        <br />
        <span className="text-lg text-[#FF0B55]">
          Powered by Text-Davinci 003
        </span>
      </Card>

      <Card
        src="/twitter.png"
        alt={"Twitter"}
        href="https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0A%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5"
        className="dark:invert"
        target="_blank"
      >
        {" "}
        Share Recipes with your Friends and Family on socials directly from our
        app
        <br />
      </Card>
    </div>
  );
};

export default Features;

const Card = ({
  children,
  src,
  alt,
  href,
  className,
  target,
}: {
  children: React.ReactNode;
  src: string;
  alt: string;
  href: string;
  className?: string;
  target?:string
}) => (
  <Link
    href={href}
    className="featureCard flex 2xl:flex-col 2xl:text-xl hover:shadow-lg dark:hover:brightness-125 transition items-center text-lg sm:text-3xl bg-slate-100/80 dark:bg-slate-900/90 py-8 px-4 sm:p-8 rounded-xl flex-wrap justify-center w-fit gap-8 sm:m-auto mx-4  max-w-2xl backdrop-blur-md relative z-20"
    target={target}
    rel={target && "noreferrer"}
  >
    <Image src={src} alt={alt} width={128} height={128} className={className} />
    <h3 className="text-slate-950 dark:text-slate-100 font-bold">
      <Balancer>{children}</Balancer>
    </h3>
  </Link>
);
