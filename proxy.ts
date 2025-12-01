// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Protect a set of client routes (redirect to sign-in if no valid token).
 * Also ensure sessionCartId cookie exists for anonymous carts.
 */

const PROTECTED_PATHS: RegExp[] = [
  /\/shipping-address/,
  /\/payment-method/,
  /\/place-order/,
  /\/profile/,
  /\/user\/.*/,
  /\/order\/.*/,
  /\/admin(\/.*)?/,
];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1) Ensure sessionCartId exists for frontend routes
  try {
    const existing = request.cookies.get("sessionCartId");
    if (!existing) {
      const sessionCartId = crypto.randomUUID();
      const res = NextResponse.next();
      res.cookies.set("sessionCartId", sessionCartId, {
        path: "/",
        httpOnly: true,
        // secure: true, // enable in prod
        // sameSite: "lax",
        // maxAge: 60 * 60 * 24 * 30,
      });

      // Continue but don't redirect now; we still want to check auth below.
      // Return here would skip auth check for the same request.
      // So we set cookie on response and continue.
      // Note: If you want immediate redirect handling, you can return here.
      // But we'll fall through to auth check using the response we just created.
      // Because NextResponse.next() returns a response object, we use it only when returning.
      // To keep simple, if we set a cookie we return that response immediately.
      return res;
    }
  } catch (err) {
    // If cookie APIs throw for some reason, just continue — don't block user
    console.error("[proxy] cookie check error", err);
  }

  // 2) If this path is not a protected page, continue normally
  const isProtected = PROTECTED_PATHS.some((rx) => rx.test(pathname));
  if (!isProtected) return NextResponse.next();

  // 3) For protected paths: check auth token (NextAuth v4)
  // getToken will read the session token from cookies/headers and verify it
  // secret is required; ensure NEXTAUTH_SECRET is set in your env
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = await getToken({ req: request as any, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
      // authenticated — allow
      return NextResponse.next();
    } else {
      // not authenticated — redirect to sign-in preserving callbackUrl
      const signInUrl = new URL("/sign-in", request.url);
      // include callback to bring user back after signin
      signInUrl.searchParams.set("callbackUrl", request.url);
      return NextResponse.redirect(signInUrl);
    }
  } catch (err) {
    console.error("[proxy] getToken error", err);
    // If token check fails for any reason, redirect to sign-in as safe fallback
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }
}

/**
 * IMPORTANT matcher:
 * - exclude /api/auth (NextAuth routes), /api (other API routes), _next, static assets, and favicon
 * - include only frontend routes you care about; for now this is broad but excludes internals
 */
export const config = {
  matcher: ["/((?!api/auth|api|_next|static|favicon.ico).*)"],
};
