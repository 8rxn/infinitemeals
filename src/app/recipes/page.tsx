import FoodCards from "@/components/FoodCards";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {};

const page = async (props: Props) => {
  return (
    <div className="text-center flex flex-col items-center gap-4 pb-20">
      <h1 className="font-bold text-5xl sm:text-7xl capitalize ">
        <Balancer>
          All{" "}
          <span className="text-[#FF0B55] dark:text-blue-500">Recipes </span>
          available until now
        </Balancer>
      </h1>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer>
          Explore all food from various cuisines that have been added to our
          database{" "}
        </Balancer>
      </p>
      <FoodCards tag={"all"} />
    </div>
  );
};

export default page;
