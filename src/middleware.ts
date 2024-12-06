"use server"
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import db from './db';
import { cookies } from 'next/headers';
import { NavType } from '@components/app/app-sidebar';

const authRoute = ['/login'];

function getPath(data: NavType[]){
    let path: string[] = [];

    data.forEach(fo => {
        if(fo.url){
            path.push(fo.url)
        }

        if(fo.items) {
            fo.items.forEach(fa => {
                path.push(fa.url)
            })
        }
    })

    return path
}

export default async function middleware(req: NextRequest) {
    // const cookie = cookies();
    const path = req.nextUrl.pathname;

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
        const getRole = await db.query.roles.findFirst({
            where: (role, { eq }) => eq(role.id, session.roleId),
        });        

        if (!getRole) {
            // cookie.delete('next-auth.session-token');
            return NextResponse.redirect(new URL('/login', req.nextUrl));
        }

        if (!getPath(getRole.access_rights as NavType[]).includes(path)) {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}