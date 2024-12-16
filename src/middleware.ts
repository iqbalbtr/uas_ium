"use server"
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import db from './db';
import { NavType } from '@components/app/app-sidebar';
import { roles } from '@db/schema';
import { eq } from 'drizzle-orm';

const authRoute = ['/login'];

function getPath(data: NavType[]) {
    let path: string[] = [];

    data.forEach(fo => {
        if (fo.url) {
            path.push(fo.url)
        }

        if (fo.items) {
            fo.items.forEach(fa => {
                path.push(fa.url)
            })
        }
    })

    return path
}

export default async function middleware(req: NextRequest) {


    const path = req.nextUrl.pathname;

    if (path == "/") {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    const isProtectedRoute = path.startsWith('/dashboard');
    const isAuthRoute = authRoute.includes(path);

    const session: any = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (isAuthRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isProtectedRoute && session) {
        const getRole = await db.select().from(roles).where(eq(roles.id, session.roleId))

        if (!getRole[0]) {
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }

        const userPath = getPath(getRole[0].access_rights as NavType[])

        if (!userPath.includes(path)) {
            return NextResponse.redirect(new URL('/not-authorized', req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}