import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import db from './db'

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/']
const authRoute = ['/login']

export default async function middleware(req: NextRequest) {

    const path = req.nextUrl.pathname

    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)
    const isAuthRoute = authRoute.includes(path)

    const session: any = await getToken({ req, secret: process.env.AUTH_SECRET });

    if (isProtectedRoute && !session?.id) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (session?.id && isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    if (
        isPublicRoute &&
        session?.id &&
        !req.nextUrl.pathname.startsWith('/dashboard')
    ) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    const getRole = await db.query.roles.findFirst({
        where: (role, { eq }) => (eq(role.id, session.roleId))
    });

    if (!getRole)
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))

    if ((!getRole.access_rights as any).includes(path))
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}