import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";



const isProd = process.env.NODE_ENV === "production";

export const authConfig = {
    providers: [], // Required by NextAuthConfig type
    // ensure cookie is configurable for dev vs prod
    cookies: {
        sessionToken: {
            name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: isProd, // only secure in production (HTTPS)
            },
        },
    },
    callbacks: {
        authorized({ request, auth }: any) {
            // Array of regex patterns of paths we want to protect
            const protectedPaths = [
                /\/shipping-address/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ];

            // Get pathname from the req URL object
            const { pathname } = request.nextUrl;

            // Check if user is not authenticated and accessing a protected path
            if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

            // NOTE: Przekazywanie headers tutaj jest zbędne ale jesli juz to  - NextResponse.next({ request: { headers: ... }}) używa się, gdy chcesz zmodyfikować headery requesta, które idą dalej (np. dodać custom header do requesta)
            // Check for session cart cookie
            if (!request.cookies.get("sessionCartId")) {
                // Generate new session cart id cookie
                const sessionCartId = crypto.randomUUID();

                // Create response and set cookie
                const response = NextResponse.next();
                response.cookies.set("sessionCartId", sessionCartId);

                return response;
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
