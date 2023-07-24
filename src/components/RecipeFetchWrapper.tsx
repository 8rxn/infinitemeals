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
  const [status, setStatus] = useState<boolean>(false)

  const fetchData = async (food: string, nationality?: string) => {
    setRecipe(null);
    console.log("fetching data - recipe",recipe)
    setIsLoading(true);
    let res = await fetch("/api/v1/get-recipe", {
      method: "POST",
      body: SuperJSON.stringify({ name: food, nationality }),
    });

    if (res.status == 404) {
      setStatus(true)
      res = await fetch("/api/v1/get-recipe-by-ai", {
        method: "POST",
        body: SuperJSON.stringify({ name: food, nationality }),
      });
      const resGpt = await res.json();

      setRecipe(await resGpt);
      setStatus(false)
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
    setRecipe(data);
    console.log("Set reicpe: ", recipe)
    setIsLoading(false);
  };

  return (
    <>
      <FoodForm fetchData={fetchData} isLoading={isLoading} status={status}  />
      <Recipe />
    </>
  );
};

export default RecipeFetchWrapper;
