import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { decrypt } from "./auth/02-stateless-session"

// 1. Specify protected and public routes
const protectedRoutes = [
    '/dashboard',
    '/'
]

const publicRoutes = [
    '/login',
    '/register'
]

export default async function middleware(req: NextRequest){
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    // 3. Decrypt the session from the cookie
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    // 4. Redirect 
    if (isProtectedRoute && !session?.user_id){
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    if (isPublicRoute && session?.user_id && !req.nextUrl.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }

    return NextResponse.next()
}