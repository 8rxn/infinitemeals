import { PizzaIcon } from "lucide-react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

const Intro = () => {
  return (
    <div className="font-semibold max-w-[80vw] mx-auto">
      <Link href={"/"}>
        <h2 className="text-3xl sm:text-5xl mb-8">
          <span className="inline-block mr-2 -translate-y-[50%] cursor-pointer ">
            <PizzaIcon />
          </span>
          <span className="inline-block hover:underline underline-offset-4 font-mono">
            Infinite Meals
          </span>
        </h2>
      </Link>
      <p className="text-xl font-light">
        <Balancer>
          {`Infinite Meals is a recipe search engine that uses OpenAI's GPT-3.5-Turbo-1106 Model through Open AI API to generate recipes for any given Food. It's a simple and easy way to find new recipes and get inspiration for your next meal.`}
        </Balancer>
      </p>
    </div>
  );
};

export default Intro;
