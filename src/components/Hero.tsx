import Button from "./ui/Button";
import Image from "next/image";
import SignInButton from "./ui/SignInButton";

const Hero = () => {
  return (
    
      <div className="flex flex-col items-center text-center gap-6 relative z-10">
        <div>
          <h1 className="font-extrabold text-3xl sm:text-8xl max-w-[90vw] dark:text-slate-100 text-gray-950">
            Infinite Meals
          </h1>

          <h2 className="font-semibold text-lg sm:text-3xl dark:text-slate-300 text-gray-600">
            Get a new meal idea every day
          </h2>
          <h2 className="font-semibold text-xs sm:text-lg text-slate-500">
            Powered By Text Davinci 3 from Open AI
          </h2>
        </div>

        <SignInButton variant={"default"}>Sign In to Search Recipes</SignInButton>
      </div>
  );
};

export default Hero;
