import 'server-only'
import type { SessionPayload } from './definition'
import { jwtVerify, SignJWT } from 'jose'
import { db } from '../../prisma/db'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

export const encrypt = async (payload: SessionPayload) => {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1hr')
        .sign(key)
}

export const decrypt = async (session: string | undefined = '') => {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256']
        })
        return payload
    } catch(error) {
        console.log(`failed to verify session`)
        return null
    }
}

export const createSession = async (id: number) => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // 1. Create a session in database
    const data = await db.session.create({
        data: {
            user_id: id,
            expires: expires
        }
    })

    // 2. Encrypt session id
    const session = await encrypt({ user_id: data.user_id, expires: data.expires })

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}