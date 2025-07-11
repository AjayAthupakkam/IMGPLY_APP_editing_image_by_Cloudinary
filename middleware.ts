import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your middleware
const isPublic = createRouteMatcher(["/", "/api/webhook/clerk", "/api/webhook/stripe"]);

export default clerkMiddleware((auth, req) => {
  if (isPublic(req)) {
    return;
  }
  // If the route is not public, continue with the default behavior
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
