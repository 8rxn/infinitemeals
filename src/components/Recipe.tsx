"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Balancer } from "react-wrap-balancer";
import { ContextProvider } from "./Providers";
import Image from "next/image";
import { z } from "zod";
import Link from "next/link";
import { DownloadIcon, Link as LinkIcon, PizzaIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import Button from "./ui/Button";
//@ts-ignore
// import { useToImage } from "@hcorta/react-to-image";

import { useToPng } from "@hugocxl/react-to-image";

import qrcode from "qrcode-generator";
import { useTheme } from "next-themes";

type Props = {};
const reqSchema = z.object({
  name: z.string().max(1000),
  id: z.string().max(1000),
});

const Recipe = (props: Props) => {
  const { recipe } = useContext(ContextProvider);

  const canvasRef = useRef(null);

  const theme = useTheme().theme;

  const [state, convertToPng, ref] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      const a = document.createElement("a");
      a.href = data;
      a.download = recipe?.name ? recipe.name : "recipe" + ".png";
      a.click();
    },
  });

  const downloadImage = () => {
    convertToPng();
  };

  const [copyText, setCopyText] = useState<"Copy Link" | "Copied">("Copy Link");
  useEffect(() => {
    const fetchImage = async () => {
      // console.log("fetching image");
      let response = await fetch("/api/v2/images/database", {
        method: "POST",
        body: JSON.stringify(
          reqSchema.parse({ name: recipe?.name || "", id: recipe?.id || "" })
        ),
      });

      if (response.status == 404) {
        response = await fetch("/api/v2/images/search", {
          method: "POST",
          body: JSON.stringify(
            reqSchema.parse({ name: recipe?.name || "", id: recipe?.id || "" })
          ),
        });

        if (response.status == 401) {
          setImg({
            url: "/burger-placeholder.webp",
            source: "https://openai.com/dall-e-2",
            domain: "DALL-E",
          });
        }
        const resGpt = await response.json();

        // console.log(resGpt);

        response = await fetch("/api/v2/images/update-image-db", {
          method: "POST",
          body: JSON.stringify({
            result: resGpt.result,
            id: recipe?.id || "",
            name: recipe?.name || "",
          }),
        });
      }

      const img: { url: string; source: string; domain: string } =
        await response.json();
      if (recipe) setImg(img);
    };
    if (recipe?.id) {
      fetchImage();
    }
    if (recipe == null) {
      setImg({
        url: "/burger-placeholder.webp",
        source: "https://openai.com/dall-e-2",
        domain: "DALLE",
      });
    }
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

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!recipe) return;

    const qr = qrcode(0, "M");
    qr.addData("https://infinitemeals.vercel.app/recipes/" + recipe.id);
    qr.make();

    //@ts-expect-error
    const context = canvasRef.current.getContext("2d");
    const qrSize = qr.getModuleCount();
    //@ts-expect-error
    const moduleSize = canvasRef.current.width / qrSize;
    
    // Set the height of the canvas to match its width
    //@ts-expect-error
    canvasRef.current.height = canvasRef.current.width;

    const cornerRadius = 1;

    const qrColor = theme === "dark" ? "#FFF" : "#FF0B55";

    for (let row = 0; row < qrSize; row++) {
      for (let col = 0; col < qrSize; col++) {
        // Change the color of the dark modules (black squares)
        context.fillStyle = qr.isDark(row, col) ? qrColor : "#ffffff00";
        const x = col * moduleSize;
        const y = row * moduleSize;
        // Draw a rounded rectangle for each module
        context.beginPath();
        context.moveTo(x + cornerRadius, y);
        context.arcTo(
          x + moduleSize,
          y,
          x + moduleSize,
          y + moduleSize,
          cornerRadius
        );
        context.arcTo(
          x + moduleSize,
          y + moduleSize,
          x,
          y + moduleSize,
          cornerRadius
        );
        context.arcTo(x, y + moduleSize, x, y, cornerRadius);
        context.arcTo(x, y, x + moduleSize, y, cornerRadius);
        context.closePath();
        context.fill();
      }
    }
  }, [recipe, canvasRef.current, theme]);

  if (!recipe) return null;

  return (
    <div
      className="bg-slate-100 dark:bg-slate-900 p-8 sm:p-12 rounded-xl shadow-lg max-[500px]:pt-16"
      ref={ref}
    >
      <h1 className="font-bold text-5xl sm:text-7xl mb-4 ">
        <Balancer>
          Here&apos;s Your Recipe for{" "}
          <span className="text-[#FF0B55] dark:text-blue-500 ">
            {recipe.name}
          </span>
          ,
        </Balancer>
        <div className="flex justify-center flex-wrap gap-x-4  max-w-[90vw]">
          {recipe.tagsRelated?.map((tag: string) => (
            <Link href={"/categories/" + tag} key={tag}>
              <p className="sm:text-2xl inline-block text-base hover:shadow-inner dark:hover:brightness-125 transition  bg-slate-200 dark:bg-slate-800 rounded-r-full rounded-l-full px-8 py-1  cursor-pointer capitalize">
                <Balancer>{tag.replaceAll("_", " ")}</Balancer>
              </p>
            </Link>
          ))}
        </div>
      </h1>

      {img?.url && (
        <div className="flex justify-between flex-wrap gap-4 items-center">
          {" "}
          <div className={"max-w-[80dvw] w-[500px] aspect-square relative "}>
            {img.url !== "/burger-placeholder.webp" ? (
              <Image
                src={img.url}
                alt={"Image of " + recipe.name}
                width={500}
                height={500}
                className="object-cover aspect-square brightness-75 rounded-xl shadow-lg"
              />
            ) : (
              <>
                <Loader2 className="w-10 h-10 animate-spin relative z-10 top-[45%] left-[45%] text-white " />
                <Image
                  src={img.url}
                  alt={"placeholder for recipe image"}
                  fill
                  className="brightness-75 blur-sm rounded-xl shadow-lg"
                />
              </>
            )}
          </div>
          <h1 className="font-bold text-lg sm:text-2xl mb-4 ">
            <Balancer>
              Image From{" "}
              <span className="text-[#FF0B55]  dark:text-blue-500 underline underline-offset-8 cursor-pointer ">
                <a href={img.source} target="_blank" rel="noreferrer">
                  {img.domain}
                </a>{" "}
                <br />
              </span>
              <span className="underline underline-offset-8 cursor-pointer mt-6 ">
                <a
                  href={`https://github.com/8rxn/infinitemeals/issues/new?title=Recipe:Error%20in%20page%20${recipe.name}&body=RecipeId:${recipe.id}+Explain+your+report`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Report Error
                </a>
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
          <React.Fragment key={index}>
            <p
              className="text-[#FF0B55] dark:text-blue-500 text-right min-w-fit col-span-1"
              key={index}
            >
              Step-{index + 1}:
            </p>
            <p className="col-span-4  " key={instruction}>
              <Balancer className="">{instruction}</Balancer>
            </p>
          </React.Fragment>
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
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300 mb-4">
        <Balancer className="italic">Bon Appetit!</Balancer>
      </p>

      <div
        className={`flex justify-center items-center gap-8 ${
          state.isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Button
          size={"lg"}
          onClick={() => {
            navigator.clipboard.writeText(
              "https://infinitemeals.vercel.app/recipes/" + recipe.id
            );
            setCopyText("Copied");
            setTimeout(() => {
              setCopyText("Copy Link");
            }, 1000);
          }}
        >
          {" "}
          {copyText}
          <span className="ml-6">
            <LinkIcon />
          </span>{" "}
        </Button>
        <Button size={"lg"} onClick={downloadImage} disabled={state.isLoading}>
          {state.isLoading && <Loader2 className="w-8 h-8 animate-spin" />}
          <span className="">{!state.isLoading && <DownloadIcon />}</span>{" "}
        </Button>
      </div>
      <div className="flex justify-between items-end relative ">
        <div className="flex gap-4">
          <p className="text-xs italic font-bold text-left max-w-[50%]">
            {" "}
            {'"'} Savor each bite, nourish your soul with the essence of food
            {' "'}
          </p>
        </div>
        {state.isLoading && (
          <div className="absolute left-[50%] translate-x-[-50%]">
            <h1 className="font-bold text-xl font-mono cursor-pointer ">
              <span className="inline-block mr-2 -translate-y-[50%] ">
                <PizzaIcon />
              </span>
              <span className="inline-block">
                Infinite <br /> Meals
              </span>
            </h1>
          </div>
        )}
        <canvas ref={canvasRef} className="max-w-[100px] mt-4 "></canvas>
      </div>
    </div>
  );
};

export default Recipe;
