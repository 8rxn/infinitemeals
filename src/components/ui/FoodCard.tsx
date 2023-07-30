"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Balancer from "react-wrap-balancer";
import { z } from "zod";

type Props = {
  name: string;
  id: string;
  imgUrl?: string;
  fetchImage: (name: string, id: string) => Promise<void>;
};

const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(1000),
});

const FoodCard = (props: Props) => {

  useEffect(() => {
    if (!props.imgUrl) {
      props.fetchImage(props.name, props.id);
    } 
  }, [props.id, props.imgUrl, props.name]);
  return (
    <Link
      href={"/recipes/" + props.id}
      className={
        "  xl:w-[25%] lg:w-[27%] mx-auto sm:mx-4 relative block overflow-hidden rounded-b-sm w-[40%] max-[500px]:w-[60vw] group rounded-lg bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-600 "
      }
    >
      {props.imgUrl ? (
        <>
          <Image
            src={props.imgUrl || ""}
            width={256}
            height={256}
            alt=""
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72 rounded-t-lg"
          />
        </>
      ) : (
        <div className="w-full mx-4 h-[256px] bg-slate-100 dark:bg-gray-950 grid place-items-center">
          {" "}
          <Loader2 className="w-10 h-10 animate-spin m-auto" />{" "}
        </div>
      )}
      <div className="grid relative mt-4 text-primary text-lg font-semibold h-fit mb-8 ">
        <h1 className="font-bold text-2xl sm:text-4xl capitalize ">
          <Balancer>
            <span className="text-[#FF0B55] dark:text-slate-100">
              {props.name}
            </span>
          </Balancer>
        </h1>
      </div>
    </Link>
  );
};

export default FoodCard;
