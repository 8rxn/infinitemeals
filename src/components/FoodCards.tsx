"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SuperJSON from "superjson";
import ImageFetchWrapper from "./ImageFetchWrapper";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/navigation";
type Props = {
  tag: string;
};

const FoodCards = (props: Props) => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
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
  const [loading, setLoading] = useState<
    | "loading"
    | ""
    | "Fetching A Recipe From GPT-3.5-Turbo-1106"
    | "Getting Recipe into our Database"
  >("");

  const fetchRecipes = async (pageNum: number) => {
    setLoading("loading");
    let res = await fetch("/api/v2/tags/recipes", {
      method: "POST",
      body: SuperJSON.stringify({ tag: props.tag, page: page, limit: 10 }),
    });

    if (res.status == 404) {
      setLoading("Fetching A Recipe From GPT-3.5-Turbo-1106");
      res = await fetch("/api/v2/tags/recipes/completion", {
        method: "POST",
        body: SuperJSON.stringify({ tag: props.tag }),
      });

      if (res.status == 429) {
        setLoading("");
        router.push("/limited#");
        return;
      }

      const resGpt = await res.json();
      // console.log(resGpt);

      setLoading("Getting Recipe into our Database");
      res = await fetch("/api/v2/recipes/update-recipe-by-ai", {
        method: "POST",
        body: SuperJSON.stringify(resGpt),
      });

      const recipe = await res.json();
      // console.log(recipe);

      setFood([
        {
          id: recipe.id,
          name: recipe.name,
          tags: recipe.tagsRelated,
          imgUrl: recipe.imgUrl,
        },
      ]);
      setLoading("");

      return;
    }

    const json = await res.json();
    const foodFetched = await json.recipes;

    if (foodFetched.length < 10) {
      setHasMore(false);
    }
    //@ts-ignore
    setFood((prevFood) => [...prevFood, ...foodFetched]);
    setLoading("");
  };
  useEffect(() => {
    setFood([]);
    fetchRecipes(1);
  }, [props.tag]);

  const debounce = (func: () => void, delay: number) => {
    let inDebounce: NodeJS.Timeout;
    return function () {
      //@ts-ignore
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      //@ts-ignore
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleScroll = debounce(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, 100);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, loading]);

  useEffect(() => {
    if (page > 1) {
      fetchRecipes(page);
    }
  }, [page]);

  return (
    <div className="flex flex-wrap w-fit sm:w-full justify-between gap-8  mt-8 mx-auto">
      {loading !== "loading" && loading ? (
        <div className="w-full">
          <Loader2 className="w-10 h-10 m-auto animate-spin"></Loader2>
          <p
            className={`text-sm font-semibold max-w-sm mx-auto col-span-full ${
              loading ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500 ease-out`}
          >
            <Balancer>{loading}</Balancer>
          </p>
        </div>
      ) : (
        <>
          {food?.length > 0 ? (
            food.flatMap((foodItem) =>
              foodItem.imgUrl ? (
                <ImageFetchWrapper
                  name={foodItem.name}
                  id={foodItem.id}
                  imgUrl={foodItem.imgUrl}
                />
              ) : (
                <ImageFetchWrapper name={foodItem.name} id={foodItem.id} />
              )
            )
          ) : (
            <></>
          )}
          {loading && hasMore && (
            <div className="w-full">
              <Loader2 className="w-10 h-10 m-auto animate-spin"></Loader2>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FoodCards;
