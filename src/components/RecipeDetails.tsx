"use client";
import React, { useEffect, useContext, useState } from "react";
import { ContextProvider } from "./Providers";
import { Loader2 } from "lucide-react";
import Recipe from "./Recipe";
import SuperJSON from "superjson";

type Props = {
  id: string;
};

function RecipeDetails({ id }: Props) {
  const { setRecipe } = useContext(ContextProvider);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRecipeById = async () => {
      setLoading(true);
      const res = await fetch("/api/v2/recipes/uid", {
        method: "POST",
        body: SuperJSON.stringify({ id: id }),
      });

      const recipe = await res.json();
      // console.log(recipe);
      setRecipe(recipe);
      setLoading(false);
    };

    fetchRecipeById();
  }, [id,setRecipe]);

  return (
    <>{loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Recipe />}</>
  );
}

export default RecipeDetails;
