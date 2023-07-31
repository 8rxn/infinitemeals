import Hero from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen grid place-items-center text-slate-100 relative overflow-hidden ">
      <Image
        src="/Pizzas.svg"
        alt="Background"
        fill
        className=" object-cover pt-40 sm:pt-0 sm:block hidden  object-center opacity-80 dark:opacity-60 w-screen mix-blend-darken dark:mix-blend-lighten "
      />
      <Image 
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className="rotate-[170deg] fixed -right-8 -bottom-12 opacity-80 sm:hidden block w-[70%] mix-blend-darken dark:mix-blend-lighten"
      />
      <Image 
        src={"/pizzafloat.svg"}
        alt="Pizza"
        width={150}
        height={150}
        className=" fixed -left-8 top-12 opacity-80 sm:hidden block w-[40%] mix-blend-darken dark:mix-blend-lighten"
      />

      <Hero />
    </div>
  );
}
