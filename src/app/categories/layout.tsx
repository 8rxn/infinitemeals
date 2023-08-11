import { DataProvider } from "@/components/Providers";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Categories | InfiniteMeals",
  description:
    "Find out recipes by Categories. Create your own categories and add recipes to them with the power of Text-Davinci-003.",
};

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:pt-44 pt-36 max-w-7xl m-auto dark:text-slate-100 text-slate-950">
      <DataProvider>{children}</DataProvider>
    </div>
  );
}

export default Layout;
