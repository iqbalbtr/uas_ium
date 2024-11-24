import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import db from './db'

const authRoute = ['/login']

export default async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname

    const isProtectedRoute = path.startsWith("/dashboard")
    const isAuthRoute = authRoute.includes(path)

    const session: any = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if(!session)
        return NextResponse.next()

    if (session && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }


    const getRole = await db.query.roles.findFirst({
        where: (role, { eq }) => (eq(role.id, session.roleId))
    });

    if (!getRole)
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))

    if (!(getRole.access_rights as string[]).includes(path))
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}