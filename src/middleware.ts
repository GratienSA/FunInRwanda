import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  ApiAuthPrefix,
  authRoutes,
  publicRoutes
} from "../../routes";
import { NextRequest } from "next/server";

export const { 
  auth,
  signIn,
  signOut,
  handlers
} = NextAuth(authConfig);

export const GET = handlers?.GET;
export const POST = handlers?.POST;

interface AuthenticatedRequest extends NextRequest {
  auth: any;
}

export default auth((req: AuthenticatedRequest) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(ApiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};