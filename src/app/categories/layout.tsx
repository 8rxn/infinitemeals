import { DataProvider } from "@/components/Providers";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:pt-44 pt-36 max-w-7xl m-auto dark:text-slate-100 text-slate-950">
      <DataProvider>{children}</DataProvider>
    </div>
  );
}

export default Layout;
