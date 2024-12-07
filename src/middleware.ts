import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import db from "./db";
import { NavType } from "@components/app/app-sidebar";

const authRoute = ["/login"];

function getPath(data: NavType[]) {
  let path: string[] = [];

  data.forEach((fo) => {
    if (fo.url) {
      path.push(fo.url);
    }

    if (fo.items) {
      fo.items.forEach((fa) => {
        path.push(fa.url);
      });
    }
  });

  return path;
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Izinkan akses langsung untuk halaman login
  if (authRoute.includes(path)) {
    return NextResponse.next();
  }

  // Ambil sesi pengguna
  const session: any = await getToken({ req, secret: process.env.AUTH_SECRET });

  // Redirect ke login jika sesi tidak ditemukan untuk rute yang dilindungi
  if (path.startsWith("/dashboard") && !session) {
    console.error("User not logged in, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Validasi akses untuk pengguna dengan sesi
  if (session) {
    const getRole = await db.query.roles.findFirst({
      where: (role, { eq }) => eq(role.id, session.roleId),
    });

    if (!getRole) {
      console.error("Role not found for session:", session.roleId);
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const accessRights = (getRole.access_rights as NavType[]) || [];
    const allowedPaths = getPath(accessRights);

    if (!allowedPaths.includes(path)) {
      console.error("Access denied for path:", path);
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next(); // Izinkan permintaan yang valid
}

export const config = {
  // Hindari menangani file statis dan API di middleware
  matcher: ["/dashboard/:path*", "/login"],
};
