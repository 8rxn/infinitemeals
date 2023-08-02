import React from "react";

type Props = {};

const Steps = (props: Props) => {
  return (
    <div className="mb-8 max-w-[80vw] mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 underline-offset-8 underline ">
        How does it Work?
      </h2>
      <div>
        <h3 className="font-light text-xl sm:text-2xl mb-2">
          Multiple Things Happen before the searched Recipe is returned to you.
        </h3>

        <ul className="text-lg sm:text-xl grid sm:grid-cols-2 grid-cols-1  justify-between gap-4 font-medium">
          <Card>
            1. The recipe is Searched for in the Redis Cache against [when
            recipe is searched for the first time, it is cached]
          </Card>
          <Card>
            2. If unavailable in cache, it&apos;s looked for in the database.
          </Card>
          <Card>
            3. If the recipe is still unavailable, Text - Davinci - 003 is used
            to get the recipe for that item.
          </Card>
          <Card>
            4. The response from Text - Davinci - 003 is displayed to the user
            at this point of time.
          </Card>
          <Card>
            5. The response from the Database is then added into the Database
            and Cached for future use.
          </Card>
          <Card>
            6. Meanwhile, When Text - Davinci - 003 is used for fetching the recipe, the image is being looked for using Google Images Search from SERP API. The image fetched from the API is added to Cloudinary.
          </Card>
          <Card>
            7. The image added is displayed while the Image URL is added into the recipe Database and cache for future use.
          </Card>
        </ul>
      </div>
    </div>
  );
};

export default Steps;

const Card = ({ children }: { children: React.ReactNode }) => (
  <li className="bg-slate-200 dark:bg-slate-800 rounded-lg p-4  hover:shadow-md transition">{children}</li>
);
