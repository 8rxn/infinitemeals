import Button from "@/components/ui/Button";
import { Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";

const RateLimit = () => {
  return (
    <div className="w-full h-full grid place-items-center relative z-20" id="">
      <h1 className="text-3xl font-bold">Rate Limit Exceeded</h1>
      <p className="text-sm font-light">
        Come Back After an hour <br />
        Touch Some Grass Perhaps
      </p>
      <Link
        className="mb-8 mt-2"
        target="_blank"
        href="https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0AI%20got%20Blocked%20out%20by%20rate%20limiting%20tho.%0AThanks%20To%20@rajxryan.%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5"
      >
        <Button variant={"default"} size={"sm"}>
          Tweet Perhaps? <span className="ml-4"><Twitter /></span>
        </Button>
      </Link>
      <p>Kudos, if you came by here without actually being rate Limited</p>
      <Link
        className=""
        target="_blank"
        href="https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0AI%20got%20Blocked%20out%20by%20rate%20limiting%20tho%20%0AOr%20Maybe%20Not.%20Thanks%20To%20@rajxryan.%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5"
      >
        <Button variant={"default"} size={"sm"}>
          Tweet plox 👉👈 <span className="ml-4"><Twitter /></span>
        </Button>
      </Link>
    </div>
  );
};

export default RateLimit;
