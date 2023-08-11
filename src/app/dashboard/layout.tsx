import { DataProvider } from "@/components/Providers";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | InfiniteMeals",
  description:
    "Search for recipes for any food that you can think of. If we don't already have it, we'll find it for you.",
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:pt-44 pt-36 max-w-7xl m-auto dark:text-slate-100 text-slate-950">
      <DataProvider>{children}</DataProvider>
    </div>
  );
}

export default Layout;
