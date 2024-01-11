"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Search } from "lucide-react";
import { FC, useContext, useState } from "react";
import SuperJSON from "superjson";
import { ContextProvider } from "./Providers";
import Balancer from "react-wrap-balancer";

type Inputs = {
  food: string;
  nationality?: string;
};

interface Props {
  fetchData: (food: string, nationality?: string) => void;
  isLoading: boolean;
  status: boolean;
}

const FoodForm: FC<Props> = ({ fetchData, isLoading, status }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetchData(data.food, data.nationality);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid px-8 grid-cols-4 gap-6 w-full mt-16 text-2xl md:text-3xl max-[500px]:mb-40"
    >
      <label
        htmlFor="food"
        className="text-left sm:col-span-1 col-span-full -mb-4 "
      >
        Food:
      </label>
      <Input
        type="text"
        className="w-full sm:col-span-3 col-span-full"
        {...register("food", { required: true })}
        placeholder="Your Favorite Food ? or any"
      />
      <h3 className="col-span-full">{errors.food?.message}</h3>
      <label
        htmlFor="Nationality"
        className="text-left sm:col-span-1 col-span-full -mb-4 "
      >
        Nationality:
      </label>
      <Input
        type="text"
        className="w-full sm:col-span-2 col-span-full"
        {...register("nationality")}
        placeholder="Where is it famously from?"
      />

      <Button
        variant={"default"}
        size={"lg"}
        type="submit"
        className="w-fit col-span-full  m-auto mt-4"
        isLoading={isLoading}
      >
        Search <Search className="ml-2" />{" "}
      </Button>
     <p
        className={`text-sm font-semibold max-w-sm mx-auto col-span-full ${
          status ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500 ease-out`}
      >
        <Balancer>Does not Exist on our Database yet! <br/> Trying on GPT-3.5-Turbo-1106</Balancer>
      </p>
    </form>
  );
};

export default FoodForm;
