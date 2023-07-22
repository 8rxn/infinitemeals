import Image from "next/image";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {};

const Features = (props: Props) => {
  return (
    <div className="flex flex-col 2xl:flex-row flex-wrap gap-8  justify-between">
      <Card src={"/burger.webp"} alt={"Burger"}>
        {" "}
        Get any recipe you&apos;d like to cook.
        <br />
        <br /> Be it Indian, Italian or even out of this world.
        <br /> <br />
        We have it all
      </Card>

      <Card src="" alt={"Burger"}>
        {" "}
        Find any category recipe you&apos;d like to cook.
        <br />
        <br /> If we don&apos;t already have it, we&apos;ll add it.
        <br /> <br />
        Powered by Text Davinci 3 by OpenAi
      </Card>


    </div>
  );
};

export default Features;

const Card = ({
  children,
  src,
  alt,
}: {
  children: React.ReactNode;
  src: string;
  alt: string;
}) => {
  return (
    <div className="featureCard flex 2xl:flex-col 2xl:text-xl hover:shadow-lg dark:hover:brightness-125 transition items-center text-xl sm:text-3xl bg-slate-100 dark:bg-slate-900 py-8 px-4 sm:p-8 rounded-xl flex-wrap justify-center w-fit gap-8 sm:m-auto mx-4 ">
      <Image src={src} alt={alt} width={128} height={128} />
      <h2 className="text-slate-950 dark:text-slate-100 font-bold">
        <Balancer>{children}</Balancer>
      </h2>
    </div>
  );
};
