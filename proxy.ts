import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/hero/:path*",
    "/admin/interests/:path*",
    "/admin/contact/:path*",
  ],
};
