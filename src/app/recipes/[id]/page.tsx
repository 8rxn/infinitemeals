import RecipeDetails from "@/components/RecipeDetails";
import Button from "@/components/ui/Button";
import { authOptions } from "@/server/auth";
import { Twitter } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {
  params: {
    id: string;
  };
};

const page = async (props: Props) => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();

  return (
    <div className="text-center flex flex-col items-center gap-4 pb-20 ">
      <h1 className="font-bold text-5xl sm:text-7xl capitalize ">
        <Balancer>
          What&apos;s food but
          <span className="text-[#FF0B55] dark:text-blue-500"> Love</span>
        </Balancer>
      </h1>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer>Food is love, food is life</Balancer>
      </p>

      <a href="https://twitter.com/rajxryan" rel="noreferrer" target="_blank">
      <Button size={"lg"}> Spread Love <span className="ml-6"><Twitter/></span> </Button>
      </a>
      <div className="mt-28">
        <RecipeDetails id={props.params.id} />
      </div>
    </div>
  );
};

export default page;
