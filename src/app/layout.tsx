import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Infinite Meals",
  description: "Get a new meal idea every day, Powered by Text-Davinci-003",
  keywords: [
    "Next.js",
    "React",
    "JavaScript",
    "Open AI",
    "Raj Aryan",
    "Text-Davinci-003",
    "AI",
    "Food",
  ],
  openGraph: {
    type: "website",
    siteName: "Infinite Meals",
    url: "https://imeals.rajaryan.work/",
    title: "Infinite Meals",
    description: "Get a new meal idea every day, Powered by Text-Davinci-003",
    images: "https://imeals.rajaryan.work/api/og",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinite Meals",
    description: "Get a new meal idea every day, Powered by Text-Davinci-003",
    creator: "@rajxryan",
    images: ["https://imeals.rajaryan.work/api/og"],
  },
  category: "technology",
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
      <body
        className={
          " antialiased bg-[#fff] dark:bg-gray-950 min-h-screen  overflow-x-hidden"
        }
      >
        <Providers>
          <div className="w-screen m-auto ">{children}</div>
          <Navbar />
          <Footer />
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-1V3PJF4DBF"/>
    </html>
  );
}
