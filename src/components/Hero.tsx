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
          Powered By GPT-3.5-Turbo-1106 from Open AI
        </h2>
      </div>
      <div className="dark:bg-gray-900 bg-gray-50 max-w-[90%] sm:max-w-sm p-2 rounded-lg border border-red-900 shadow-md text-gray-900 dark:text-gray-50 text-xs">
        <p>
          We're Currently experiencing database issues with Planet Scale
          shutting off hobby services for our region. We're working on a fix and
          will be back up soon. Thank you for your patience. As we use our
          database as well for sessions, the signin attempts will fail too
        </p>

        <a href="mailto:hi@rajaryan.work">
          <Button variant={"link"}>Contact us</Button>
        </a>
      </div>

      <SignInButton variant={"default"}>Sign In to Search Recipes</SignInButton>
    </div>
  );
};

export default Hero;
