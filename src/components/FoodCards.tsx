"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import FoodCard from "./ui/FoodCard";
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
      const res = await fetch("/api/v1/get-recipes-by-tag", {
        method: "POST",
        body: SuperJSON.stringify({ tag: props.tag }),
      });

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
          {food.length > 0 ? (
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
