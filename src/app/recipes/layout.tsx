import { DataProvider } from "@/components/Providers";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "All Recipes | InfiniteMeals",
  description: "All the recipes that have been added using Text-Davinci-003 by various users. Find out more here.",
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:pt-44 pt-36 max-w-7xl m-auto dark:text-slate-100 text-slate-950">
      <DataProvider>{children}</DataProvider>
    </div>
  );
}

export default Layout;
