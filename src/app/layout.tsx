import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infinite Meals",
  description: "Get a new meal idea every day",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("bg-white text-slate-900 antialiased ", inter.className)}
    >
      <body className={" antialiased bg-[#fff] dark:bg-gray-950 min-h-screen  overflow-x-hidden"}>
        <Providers>
          <div className="w-screen m-auto ">
            {children}
          </div>
          <Navbar />
        </Providers>
      </body>
    </html>
  );
}
