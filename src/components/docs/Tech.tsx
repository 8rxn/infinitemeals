const Tech = () => {
  return (
    <div className="mb-8 max-w-[80vw] mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4 underline underline-offset-8 ">
        Tech That was Used:
      </h2>
      <div>
        <ul className="text-lg sm:text-xl grid grid-cols-2 sm:flex-row sm:flex sm:flex-wrap justify-between gap-4">
          {[
            "Upstash - Redis \nCaching & Rate Limiting",
            "Open AI API - AI Generated Recipes",
            "SERP API - Images",
            "Cloudinary - Image Storage",
            "Planet Scale - ServerLess MySQL DB",
            "Prisma - ORM",
            "Next Auth- Auth",
            "Next.js 13.4.9 - Project",
            "Vercel - Deployment"
          ].map((item, i) => (
            <Card key={i}>{item}</Card>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tech;

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className=" w-fit rounded-lg bg-slate-200 dark:bg-slate-800 p-4 hover:shadow-md font-medium transition grid place-items-center ">
        {children}
      </div>
    </>
  );
};
