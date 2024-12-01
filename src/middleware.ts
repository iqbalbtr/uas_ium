import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import db from './db';

const AUTH_ROUTES = ['/login'];
const DASHBOARD_ROUTE = '/dashboard';
const ERROR_ROUTE = '/error';

export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    const isProtectedRoute = path.startsWith(DASHBOARD_ROUTE);
    const isAuthRoute = AUTH_ROUTES.includes(path);

    const session = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (isProtectedRoute && !session) {
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (!session) {
      return NextResponse.next();
    }

    const role = await db.query.roles.findFirst({
        where: (role, { eq }) => (eq(role.id, session.roleId as number))
    });

    if (!role) {
      return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.nextUrl));
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.nextUrl));
    }

    if (!(role.access_rights as string[]).includes(path)) {
      return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware Error:', error);

    return NextResponse.redirect(new URL(ERROR_ROUTE, req.nextUrl));
  }
}

export const config = {
};
