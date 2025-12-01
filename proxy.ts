// proxy.ts
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  //console.log("[proxy] running for:", request.nextUrl.pathname);

  try {
    const existing = request.cookies.get("sessionCartId");
    if (existing) {
      //console.log("[proxy] found sessionCartId cookie:", existing.value);
      return NextResponse.next();
    }

    const sessionCartId = crypto.randomUUID();
    //console.log("[proxy] setting sessionCartId:", sessionCartId);

    const res = NextResponse.next();
    res.cookies.set("sessionCartId", sessionCartId, {
      path: "/",
      httpOnly: true,
      // secure: true, // enable in production (HTTPS)
      // sameSite: 'lax',
      // maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    console.error("[proxy] ERROR:", err);
    return NextResponse.next();
  }
}

// run for all routes while debugging; change to a narrower matcher in production
export const config = {
  matcher: ["/:path*"],
};
