import Image from "next/image";
import Link from "next/link";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {};

const Features = (props: Props) => {
  return (
    <div className="flex flex-col 2xl:flex-row flex-wrap gap-8  justify-between">
      <Image
        src="/Pizzas.svg"
        alt="Background"
        fill
        className=" object-cover pt-40 sm:pt-0 sm:block hidden  object-center opacity-80 dark:opacity-60 w-screen mix-blend-darken dark:mix-blend-lighten  "
      />
      <Image
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className="rotate-[170deg] absolute -right-8 -bottom-12 opacity-80 sm:hidden block w-[70%] mix-blend-darken dark:mix-blend-lighten "
      />
      <Image
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className=" absolute -left-8 top-12 opacity-80 sm:hidden block w-[40%] mix-blend-darken dark:mix-blend-lighten "
      />
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
        Powered by Text-Davinci 003
      </Card>

      <Card src="/twitter.png" alt={"Twitter"} href="#" className="dark:invert">
        {" "}
        Share Recipes with your Friends and Family on socials directly from our
        app
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
}: {
  children: React.ReactNode;
  src: string;
  alt: string;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className="featureCard flex 2xl:flex-col 2xl:text-xl hover:shadow-lg dark:hover:brightness-125 transition items-center text-xl sm:text-3xl bg-slate-100 dark:bg-slate-900/90 py-8 px-4 sm:p-8 rounded-xl flex-wrap justify-center w-fit gap-8 sm:m-auto mx-4  max-w-2xl backdrop-blur-md relative z-20"
    >
      <Image
        src={src}
        alt={alt}
        width={128}
        height={128}
        className={className}
      />
      <h3 className="text-slate-950 dark:text-slate-100 font-bold">
        <Balancer>{children}</Balancer>
      </h3>
    </Link>
  );
};
