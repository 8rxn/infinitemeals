"use client";
import React, { useContext, useEffect, useState } from "react";
import { Balancer } from "react-wrap-balancer";
import { ContextProvider } from "./Providers";
import Image from "next/image";
import { z } from "zod";
import Link from "next/link";

type Props = {};
const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(1000),
});

const Recipe = (props: Props) => {
  
  const { recipe } = useContext(ContextProvider);
  useEffect(() => {
    const fetchImage = async () => {
      setImg({
        url: "/burger-placeholder.webp",
        source: "https://openai.com/dall-e-2",
        domain: "DALLE",
      });
      console.log("fetching image");
      const response = await fetch("http://localhost:3000/api/v1/get-image", {
        method: "POST",
        body: JSON.stringify(
          reqSchema.parse({ name: recipe?.name || "", id: recipe?.id || "" })
        ),
      });
  
      const img: { url: string; source: string; domain: string } =
        await response.json();
      setImg(img);
    };
    fetchImage();
  }, [recipe]);
  const [img, setImg] = useState<{
    url: string;
    source: string;
    domain: string;
  } | null>({
    url: "/burger-placeholder.webp",
    source: "https://openai.com/dall-e-2",
    domain: "DALLE",
  });
  if(!recipe) return <h1 className="text-3xl sm:text-5xl font-bold">Something Went Wrong</h1>



  

  return (
    <div className="bg-slate-100 dark:bg-slate-900 p-8 sm:p-12 rounded-xl shadow-lg max-[500px]:pt-16">
      <h1 className="font-bold text-5xl sm:text-7xl mb-4 ">
        <Balancer>
          Here&apos;s Your Recipe for{" "}
          <span className="text-[#FF0B55] dark:text-blue-500 ">
            {recipe.name}
          </span>
          ,
        </Balancer>
        <div className="flex justify-center flex-wrap gap-x-4  max-w-[90vw]">
          {recipe.tags?.map((tag: string) => (
            <Link href={"/categories/" + tag} key={tag}>
              <p className="sm:text-2xl inline-block text-base hover:shadow-inner dark:hover:brightness-125 transition  bg-slate-200 dark:bg-slate-800 rounded-r-full rounded-l-full px-8 py-1  cursor-pointer capitalize">
                <Balancer>{tag.replaceAll(" ", "_")}</Balancer>
              </p>
            </Link>
          ))}
        </div>
      </h1>

      {img?.url && (
        <div className="flex justify-between flex-wrap gap-4 items-center">
          {" "}
          <Image
            src={img.url}
            alt={"Image of " + recipe.name}
            width={500}
            height={500}
            className="object-cover max-w-[80dvw] aspect-square rounded-xl shadow-lg"
          />
          <h1 className="font-bold text-lg sm:text-2xl mb-4 ">
            <Balancer>
              Image From{" "}
              <span className="text-[#FF0B55]  dark:text-blue-500 underline underline-offset-8 cursor-pointer ">
                <a href={img.source}>{img.domain}</a> <br />
              </span>
              <span className="underline underline-offset-8 cursor-pointer mt-6 ">
                Report Error
              </span>
            </Balancer>
          </h1>
        </div>
      )}

      <h2 className="font-bold text-3xl text-left sm:text-5xl my-8  ">
        <Balancer>
          {" "}
          <span className="text-[#FF0B55] dark:text-blue-500 ">
            Ingredients :
          </span>
        </Balancer>
      </h2>
      <div className="grid w-fit m-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 font-semibold sm:text-xl text-sm text-left text-slate-800 dark:text-slate-300 ">
        {recipe.ingredients.map((ingredient) => (
          <p className="" key={ingredient}>
            <Balancer className="">
              <span className="text-[#FF0B55] dark:text-blue-500 mr-4">
                {" "}
                &#8226;
              </span>
              {ingredient}
            </Balancer>
          </p>
        ))}
      </div>

      <h2 className="font-bold text-3xl text-left sm:text-5xl my-8 ">
        <Balancer>
          {" "}
          <span className="text-[#FF0B55] dark:text-blue-500 ">
            Cook Along :
          </span>
        </Balancer>
      </h2>
      <div className="grid w-fit m-auto grid-cols-5 sm:gap-8 gap-2 font-semibold sm:text-xl text-sm text-left text-slate-800 dark:text-slate-300 ">
        {recipe.instructions.map((instruction, index) => (
          <>
            <p className="text-[#FF0B55] dark:text-blue-500 text-right min-w-fit col-span-1">
              Step-{index + 1}:
            </p>
            <p className="col-span-4  ">
              <Balancer className="">{instruction}</Balancer>
            </p>
          </>
        ))}
      </div>

      <h2 className="font-bold text-3xl  sm:text-5xl my-8 ">
        <Balancer>
          Enjoy Your Tasty serving of{" "}
          <span className="text-[#FF0B55] dark:text-blue-500 ">
            {recipe.name}
          </span>
        </Balancer>
      </h2>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer className="italic">Bon Appetit!</Balancer>
      </p>
    </div>
  );
};

export default Recipe;