"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContextProvider } from "./Providers";
import SuperJSON from "superjson";
import FoodForm from "./FoodForm";
import Recipe from "./Recipe";

type Props = {};

const RecipeFetchWrapper = (props: Props) => {
  const { recipe, setRecipe } = useContext(ContextProvider);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async (food: string, nationality?: string) => {
    setIsLoading(true);
    let res = await fetch("/api/v1/get-recipe", {
      method: "POST",
      body: SuperJSON.stringify({ name: food, nationality }),
    });

    if (res.status == 404) {
      res = await fetch("/api/v1/get-recipe-by-ai", {
        method: "POST",
        body: SuperJSON.stringify({ name: food, nationality }),
      });
      const resGpt = await res.json();

      setRecipe(await resGpt);
      setIsLoading(false);
      res = await fetch("/api/v1/update-recipe-by-ai", {
        method: "POST",
        body: SuperJSON.stringify(resGpt),
      });
    }
    const data = await res.json();

    console.log(data);
    if (data.error) {
      setIsLoading(false);
      return;
    }
    setRecipe(recipe ? { ...recipe, id: data.id } : data);
    setIsLoading(false);
  };

  return (
    <>
      <FoodForm fetchData={fetchData} isLoading={isLoading} />
      <Recipe />
    </>
  );
};

export default RecipeFetchWrapper;
