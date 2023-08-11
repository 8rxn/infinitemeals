import RecipeDetails from "@/components/RecipeDetails";
import Button from "@/components/ui/Button";
import { Twitter} from "lucide-react";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {
  params: {
    id: string;
  };
};

const page = async (props: Props) => {

  return (
    <div className="text-center flex flex-col items-center gap-4 pb-20 ">
      <h1 className="font-bold text-5xl sm:text-7xl capitalize ">
        <Balancer>
          What&apos;s food but
          <span className="text-[#FF0B55] dark:text-blue-500"> Love</span>
        </Balancer>
      </h1>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer>Food is love, food is life</Balancer>
      </p>

      <a
        href={`https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0A%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5`}
        rel="noreferrer"
        target="_blank"
      >
        <Button size={"lg"}>
          {" "}
          Spread Love{" "}
          <span className="ml-6">
            <Twitter />
          </span>{" "}
        </Button>
      </a>

      <div className="mt-28">
        <RecipeDetails id={props.params.id} />
      </div>
    </div>
  );
};

export default page;
