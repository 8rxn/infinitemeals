"use client";
import React, { useContext, useState } from "react";
import { ContextProvider } from "./Providers";
import SuperJSON from "superjson";
import FoodForm from "./FoodForm";
import Recipe from "./Recipe";
import { useRouter } from "next/navigation";

type Props = {};

const RecipeFetchWrapper = (props: Props) => {
  const { recipe, setRecipe } = useContext(ContextProvider);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  const router = useRouter();

  const fetchData = async (food: string, nationality?: string) => {
    setRecipe(null);
    setIsLoading(true);
    let res = await fetch("/api/v2/recipes/database", {
      method: "POST",
      body: SuperJSON.stringify({ name: food, nationality }),
    });

    if (res.status == 404) {
      setStatus(true);
      res = await fetch("/api/v2/recipes/completion", {
        method: "POST",
        body: SuperJSON.stringify({ name: food, nationality }),
      });

      if (res.status == 429) {
        router.push("/limited#");
        return
      }
      const resGpt = await res.json();

      // console.log(resGpt);

      setRecipe(await resGpt);
      // console.log(recipe);
      setStatus(false);
      setIsLoading(false);
      res = await fetch("/api/v2/recipes/update-recipe-by-ai", {
        method: "POST",
        body: SuperJSON.stringify(resGpt),
      });
    }

    const data = await res.json();

    // console.log(data);
    if (data.error) {
      setIsLoading(false);
      return;
    }
    setRecipe(data);
    // console.log("Set recipe: ", recipe);
    setIsLoading(false);
  };

  return (
    <>
      <FoodForm fetchData={fetchData} isLoading={isLoading} status={status} />
      <Recipe />
    </>
  );
};

export default RecipeFetchWrapper;
