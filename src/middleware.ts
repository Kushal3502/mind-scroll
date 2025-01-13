import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await auth();
  const url = request.nextUrl;

  if (
    user &&
    (url.pathname.startsWith("/signin") || url.pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !user &&
    (url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/favourites") ||
      url.pathname.startsWith("/blogs"))
  ) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/signin", "/signup", "/:path*", "/dashboard/:path*"],
};
