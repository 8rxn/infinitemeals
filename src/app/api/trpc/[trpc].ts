import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { NextApiRequest, NextApiResponse } from "next";

// export API handler
// const nextApiHandler =
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
          );
        }
      : undefined,
});

// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//     return nextApiHandler(req, res)
// };

// export {handler as GET, handler as POST};
