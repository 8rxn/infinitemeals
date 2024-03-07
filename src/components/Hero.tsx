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

        <a
            href="https://www.producthunt.com/posts/infinite-meals?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-infinite&#0045;meals"
            target="_blank"
            className=""
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=443254&theme=neutral"
              alt="Infinite&#0032;Meals - Get&#0032;a&#0032;new&#0032;meal&#0032;idea&#0032;every&#0032;day&#0032;Powered&#0032;By&#0032;GPT&#0045;3&#0046;5&#0045;Turbo&#0045;1106 | Product Hunt"
              style={{ width: "125px", height: "27px" }}
              width="125"
              height="27"
            />
          </a>
        <SignInButton variant={"default"}>Sign In to Search Recipes</SignInButton>

        
      </div>
  );
};

export default Hero;
