import Link from "next/link";
import React from "react";
import Button from "../ui/Button";
import { ArrowUpRightSquare } from "lucide-react";

type Props = {};

const Guide = (props: Props) => {
  return (
    <div className="mb-8 max-w-[80vw] mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 underline underline-offset-8 ">
        How to Get Recipe?
      </h2>
      <div>
        <h3 className="text-xl sm:text-2xl mb-2 font-light">
          You can find Recipes in multiple ways
        </h3>
        <ul className="text-lg sm:text-xl sm:flex-row flex flex-col  justify-between gap-4">
          <Card link="/dashboard">
            1. You can search for any recipe by going on your dashboard and
            searching for a recipe.
          </Card>
          <Card link="/categories">
            2. You can find recipes by going to the categories page and
            selecting a category that you want to find recipes for.
          </Card>
          <Card link="/recipes">
            3. You can find recipes by going to the all recipes page and
            selecting a recipe that you&apos;d like.
          </Card>
        </ul>
      </div>
    </div>
  );
};

export default Guide;

const Card = ({
  children,
  link,
}: {
  children: React.ReactNode;
  link: string;
}) => {
  return (
    <>
      <div className="aspect-video max-w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 p-8 hover:shadow-md font-semibold transition ">
        {children}
        <br />
        <br />
        <Link href={link} className="block w-fit m-auto">
          <Button variant={"default"}>
            Try Out <span className="ml-4"><ArrowUpRightSquare /></span>
          </Button>
        </Link>
      </div>
    </>
  );
};
