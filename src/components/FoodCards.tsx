"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import ImageFetchWrapper from "./ImageFetchWrapper";
type Props = {
  tag: string;
};

const FoodCards = (props: Props) => {
  const [food, setFood] = useState<
    | [
        {
          name: string;
          tags: string[];
          id: string;
          imgUrl: string;
        }
      ]
    | []
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      let res = await fetch("/api/v1/get-recipes-by-tag", {
        method: "POST",
        body: SuperJSON.stringify({ tag: props.tag }),
      });
      if (res.status == 404) {
        res = await fetch("/api/v1/get-recipe-by-tag-ai", {
          method: "POST",
          body: SuperJSON.stringify({ tag: props.tag }),
        });

        const resGpt = await res.json();
        console.log(resGpt);

        res = await fetch("/api/v1/update-recipe-by-ai", {
          method: "POST",
          body: SuperJSON.stringify(resGpt),
        });

        const recipe = await res.json();
        console.log(recipe);

        setFood([
          { id: recipe.id, name: recipe.name, tags: recipe.tagsRelated, imgUrl: recipe.imgUrl },
        ]);
        setLoading(false);

        return;
      }

      const json = await res.json();
      const foodFetched = await json.recipes;

      console.log(foodFetched);
      setFood(foodFetched);
      setLoading(false);
    };
    fetchRecipes();
  }, [props.tag]);
  return (
    <div className="flex flex-wrap w-fit sm:w-full justify-between gap-8  mt-8 mx-auto">
      {loading ? (
        <Loader2 className="w-10 h-10 m-auto animate-spin"></Loader2>
      ) : (
        <>
          {food?.length > 0 ? (
            food.flatMap((foodItem) =>
              foodItem.imgUrl ? (
                <ImageFetchWrapper
                  name={foodItem.name}
                  id={foodItem.id}
                  tags={foodItem.tags}
                  imgUrl={foodItem.imgUrl}
                />
              ) : (
                <ImageFetchWrapper
                  name={foodItem.name}
                  id={foodItem.id}
                  tags={foodItem.tags}
                />
              )
            )
          ) : (
            <h2 className="text-xl sm:text-3xl font-bold">
              Something Went Wrong
            </h2>
          )}
        </>
      )}
    </div>
  );
};

export default FoodCards;
