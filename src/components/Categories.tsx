"use client";
import { Loader2, XIcon, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import Button from "./ui/Button";
import { SubmitHandler, useForm } from "react-hook-form";
import Input from "./ui/Input";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const Categories = (props: Props) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [categoryForm, setCategoryForm] = useState<boolean>(false);

  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const res = await fetch("/api/v2/tags/get-tags", {
        method: "GET",
      });

      const json = await res.json();
      const tagsFetched = json.tags;

      // console.log(tags);
      setTags(tagsFetched);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const createCategory = async (category: string) => {
    if (!category) return;
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    if (
      tags?.some((value) => {
        value === category;
      })
    )
      return;
    setTags([...tags, category]);
    setLoading(true);
    try {
      const res = await fetch("/api/v2/tags/create", {
        method: "POST",
        body: JSON.stringify({ tag: category }),
      });

      if (res.status == 200) {
        setCategoryForm(false);
      } else if (res.status==429) {
        router.push("/limited#");
      } else {
        setTags(tags.filter((value) => value !== category));
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  interface Inputs {
    category: string;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    createCategory(data.category);
  };

  return (
    <div className="mt-20">
      <h1 className="font-bold text-3xl sm:text-5xl ">
        <Balancer>
          <span className="">Tags</span>
        </Balancer>
      </h1>

      {loading ? (
        <Loader2 className=" mt-4 m-auto h-10 w-10 text-[#FF0B55] animate-spin" />
      ) : (
        <div className="flex gap-8 justify-center mt-8 flex-wrap flex-1 max-w-[90vw]">
          {tags &&
            tags?.map((tag: string) => (
              <Link href={"/categories/" + tag} key={tag}>
                <p className="sm:text-2xl inline-block text-base text-[#FF0B55] dark:text-blue-500 underline underline-offset-8 cursor-pointer capitalize hover:bg-slate-900/5  dark:hover:backdrop-brightness-110  dark:hover:bg-slate-100/10  transition ">
                  <Balancer>{tag.replaceAll("_", " ")}</Balancer>
                </p>
              </Link>
            ))}
          <Button
            variant={"ghost"}
            className="sm:text-2xl relative inline-flex text-base text-[#FF0B55] dark:text-blue-500 rounded-r-full cursor-pointer group"
            onClick={() => setCategoryForm(!categoryForm)}
          >
            {!categoryForm && <Plus />}
            {categoryForm && <XIcon />}
          </Button>
        </div>
      )}

      {categoryForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid px-8 grid-cols-4 gap-6 w-full mt-16 text-2xl md:text-3xl max-[500px]:mb-40"
        >
          <Input
            type="text"
            className="w-full sm:col-span-3 col-span-full m-auto"
            {...register("category", { required: true })}
            placeholder="Your Favorite Food Category"
          />

          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            className="w-fit sm:col-span-1  col-span-full  m-auto"
            disabled={loading}
          >
            Add
          </Button>
          <h3 className="col-span-full">{errors.category?.message}</h3>
        </form>
      )}
    </div>
  );
};

export default Categories;
