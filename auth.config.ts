import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
        const isLoggedIn = !!auth?.user;

        const isOnHome = nextUrl.pathname.startsWith("/home");
        const isApiRoute =
        nextUrl.pathname.startsWith("/api") ||
        nextUrl.pathname.startsWith("/place-details") ||
        nextUrl.pathname.startsWith("/youtube") ||
        nextUrl.pathname.startsWith("/weather");

        if (isApiRoute) {
        return true;
        }

        if (isOnHome) {
        return isLoggedIn;
        }

        if (isLoggedIn && nextUrl.pathname === "/login") {
        return Response.redirect(new URL("/home", nextUrl));
        }

        return true;
    },
    },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;