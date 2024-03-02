import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { withAuth } from "next-auth/middleware";
import { redis } from "./server/redis";


const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(5, "1 h"),
});

export default withAuth(
  async function middleware(
    request: NextRequest,
    event: NextFetchEvent
  ): Promise<Response | undefined> {
    if (request.nextUrl.pathname.startsWith("/api")) {
      const ip = request.ip ?? "127.0.0.1";

      console.log("Middlware Ran Check");

      const { success, pending, limit, reset, remaining } =
        await ratelimit.limit(`ratelimit_middleware_${ip}`);
      event.waitUntil(pending);

      if (success) console.log("Working Middleware!!!!");

      const res = success
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/api/blocked", request.url));

      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }
  },

  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/api/v2/recipes/completion",
    "/api/v2/recipes/update-recipe-by-ai",
    "/api/v2/tags/recipes/completion",
    "/api/v2/images/completion",
    "/api/v2/tags/create",
    "/api/v2/tags/recipes/completion",
    "/dashboard",
    "/categories",
  ],
};
