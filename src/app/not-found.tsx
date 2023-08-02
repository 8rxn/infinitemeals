import Button from "@/components/ui/Button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Twitter } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center text-slate-950 dark:text-slate-100 relative overflow-hidden ">
      <Image
        src="/Pizzas.svg"
        alt="Background"
        width={1920}
        height={1080}
        className=" fixed object-cover left-0 top-0 pt-40 sm:pt-0 sm:block hidden  object-center opacity-80 dark:opacity-60 w-screen mix-blend-darken dark:mix-blend-lighten min-h-screen  "
      />
      <Image
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className="rotate-[170deg] fixed -right-8 -bottom-12 opacity-80 sm:hidden block w-[70%] mix-blend-darken dark:mix-blend-lighten "
      />
      <Image
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className=" fixed -left-8 top-12 opacity-80 sm:hidden block w-[40%] mix-blend-darken dark:mix-blend-lighten "
      />
      <div className="flex flex-col gap-4  font-medium text-center relative z-20">
        <h2 className="font-bold text-4xl sm:text-5xl ">Oops</h2>
        <p>The page you were looking for seems to not exist</p>
        <p>If this seems to be the correct page, Write to us at <Link href="mailto:rajxryn@gmail.com" className="text-[#ff0b55] underline underline-offset-8 " target="_blank" rel="noreferrer">Support</Link> </p>
        <div className="flex justify-between gap-4 max-w-sm items-center mx-auto">
        <Link
        className=""
        target="_blank"
        href="https://twitter.com/intent/tweet?text=Hey%20everyone,%0ACheckout%20InfiniteMeals,%20where%20you%20can%20get%20any%20recipe%20known%20to%20you.%0AI%20got%20Blocked%20out%20by%20rate%20limiting%20tho.%0AThanks%20To%20@rajxryan.%0A%0Ahttps://infinitemeals.vercel.app%0A%0ASpread%20Love%20%E2%99%A5"
      >
        <Button variant={"default"} size={"sm"}>
          Tweet Perhaps? <span className="ml-4"><Twitter /></span>
        </Button>
      </Link>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
        </div>
      </div>
    </div>
  );
}
