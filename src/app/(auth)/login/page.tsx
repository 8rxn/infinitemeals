import Button from "@/components/ui/Button";
import SignInButton from "@/components/ui/SignInButton";
import { authOptions } from "@/server/auth";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Balancer from "react-wrap-balancer";

type Props = {};

const login = async (props: Props) => {
  const user = await getServerSession(authOptions);
  if (user) {
    redirect("/dashboard");
  }
  return (
    <div className="relative z-20 flex flex-col justify-center items-center h-screen max-w-4xl m-auto px-4  ">
      <Link href="/" className="self-start sm:ml-16">
        <Button
          variant={"default"}
          size={"sm"}
          className="flex gap-2  "
        >
          <ArrowLeft />
          Back{" "}
        </Button>
      </Link>
      <h3 className="text-slate-950 dark:text-slate-100 font-bold text-xl 2xl:text-3xl mb-4 text-center leading-10 max-w-3xl">
        <Balancer>
          We require you to sign-in to search and get new recipes From
          Text-Davinci 003
        </Balancer>
      </h3>
      {!user && (
        <SignInButton className="w-fit">Sign In With Discord </SignInButton>
      )}
    </div>
  );
};

export default login;
