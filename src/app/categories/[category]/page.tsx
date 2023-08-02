import FoodCards from "@/components/FoodCards";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {
  params: {
    category: string;
  };
};

const page = async (props: Props) => {
  return (
    <div className="text-center flex flex-col items-center gap-4 pb-20">
      <h1 className="font-bold text-5xl sm:text-7xl capitalize ">
        <Balancer>
          <span className="text-[#FF0B55] dark:text-blue-500">
            {props.params?.category.replaceAll("_", " ")}
          </span>
        </Balancer>
      </h1>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer>Explore food from this category</Balancer>
      </p>
      <FoodCards tag={props.params?.category} />
    </div>
  );
};

export default page;
