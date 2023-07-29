"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { createContext, useState } from "react";
export interface data {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  tagsRelated: string[];
  imgUrl: string;
  imgSource: string;
  imgDomain: string;
}

export const ContextProvider = createContext<{recipe:data | null,setRecipe:React.Dispatch<React.SetStateAction<data | null>>}>({recipe:null,setRecipe:()=>{}});

import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  );
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [recipe, setRecipe] = useState<data | null>(null);

  return (
    <ContextProvider.Provider value={{recipe,setRecipe}} >{children}</ContextProvider.Provider>
  );
};

export default Providers;
