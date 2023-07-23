"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Search } from "lucide-react";
import { FC, useContext, useState } from "react";
import SuperJSON from "superjson";
import { ContextProvider } from "./Providers";

type Inputs = {
  food: string;
  nationality?: string;
};

interface Props {
  fetchData: (food: string, nationality?: string) => void;
  isLoading :  boolean;
}

const FoodForm: FC<Props> = ({ fetchData, isLoading }) => {

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
    </form>
  );
};

export default FoodForm;
