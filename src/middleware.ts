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

      console.log("check if it works");

      const { success, pending, limit, reset, remaining } =
        await ratelimit.limit(`ratelimit_middleware_${ip}`);
      event.waitUntil(pending);

      if (success) console.log("it works!!!!");

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

// export default withAuth(
//   async function middleware(req) {
//     const pathname = req.nextUrl.pathname;

//     //Manage rate limiting

//     if (pathname.startsWith("/api")) {
//       const ip = req.ip ?? "127.0.0.1";
//       try {
//         const { success } = await ratelimit.limit(ip);
//         if (!success) {
//           return NextResponse.json(
//             { error: "Too many requests" },
//             { status: 429 }
//           );
//         }
//         return NextResponse.next();
//       } catch (error) {
//         return NextResponse.json(
//           { error: "Internal Server Error" },
//           { status: 500 }
//         );
//       }
//     }

//     //route protection

//     const token = await getToken({ req });
//     const isAuth = !!token;

//     const isAuthPage = pathname.startsWith("/login");

//     const sensitiveRoutes = ["/dashboard","/categories"];
//     if (isAuthPage) {
//       if (isAuth) {
//         return NextResponse.redirect(new URL('/dashboard', req.url))
//       }

//       return null
//     }

//     if (
//       !isAuth &&
//       sensitiveRoutes.some((route) => pathname.startsWith(route))
//     ) {
//       return NextResponse.redirect(new URL('/login', req.url))
//     }
//   },
//   {
//     callbacks: {
//       async authorized() {
//         // This is a work-around for handling redirect on auth pages.
//         // We return true here so that the middleware function above
//         // is always called.
//         return true;
//       },
//     },
//   }
// );

export const config = {
  matcher: [
    "/api/v2/recipes/completion",
    "/api/v2/recipes/update-recipe-by-ai",
    "/api/v2/tags/recipes/completion",
    "/api/v2/images/update-image-db",
    "/api/v2/images/completion",
    "/api/v2/tags/create",
    "/api/v2/tags/recipes/completion",
    "/dashboard",
    "/categories",
  ],
};
