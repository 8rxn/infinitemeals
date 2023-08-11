import React from "react";
import Image from "next/image";



function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:pt-44 pt-36 max-w-7xl m-auto dark:text-slate-100 text-slate-950 min-h-[100vh]">
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
      {children}
    </div>
  );
}

export default Layout;
