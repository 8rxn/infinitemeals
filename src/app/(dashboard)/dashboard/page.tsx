import FoodForm from "@/components/FoodForm";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import { Balancer } from "react-wrap-balancer";
import { notFound } from "next/navigation";
import Recipe from "@/components/Recipe";
import RecipeFetchWrapper from "@/components/RecipeFetchWrapper";

const Dashboard = async () => {
  const user = await getServerSession(authOptions);
  if (!user) return notFound();
  return (
    <div className="text-center flex flex-col items-center gap-4 pb-20">
      <h1 className="font-bold text-5xl sm:text-7xl ">
        <Balancer>Hello <span className="text-[#FF0B55] dark:text-blue-500">{user?.user.name}</span>,</Balancer>
      </h1>
      <p className="sm:text-3xl text-lg text-slate-800 dark:text-slate-300">
        <Balancer>
          Look for your favorite food and let Text Davinci 3 help you cook it
        </Balancer>
      </p>
      <RecipeFetchWrapper/>

    </div>
  );
};

export default Dashboard;
