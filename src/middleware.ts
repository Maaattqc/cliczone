import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "site-access";

function isPasswordRoute(pathname: string) {
  return pathname === "/password" || pathname.startsWith("/api/verify-password");
}

function isPublicAsset(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/monitoring") ||
    /\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/.test(pathname)
  );
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Skip password check for static assets and the password page itself
  if (isPublicAsset(pathname) || isPasswordRoute(pathname)) {
    return NextResponse.next();
  }

  // Check if site password is configured
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.next();
  }

  // Check for valid access cookie
  const accessCookie = request.cookies.get(COOKIE_NAME);
  if (accessCookie?.value === "granted") {
    return NextResponse.next();
  }

  // Redirect to password page
  const passwordUrl = new URL("/password", request.url);
  passwordUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(passwordUrl);
});

export const config = {
  matcher: [
    "/((?!monitoring|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
