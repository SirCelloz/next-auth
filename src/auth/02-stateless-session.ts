import 'server-only'

import type { SessionPayload } from './definition'
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey)

export const encrypt = async (payload: SessionPayload) => {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1hr')
      .sign(key);
  }
  
export const decrypt = async (session: string | undefined = '') => {
    try {
        const { payload } = await jwtVerify(session, key, {
        algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        return null;
    }
}

export const createSession = async (user_id: number | string) => {
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const session = await encrypt({ user_id, expires });
  
    cookies().set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: 'lax',
      path: '/',
    });
  
    redirect('/dashboard');
}

export const verifySession = async () => {
    const cookie = cookies().get('session')?.value
    const session = await decrypt(cookie)

    if (!session?.user_id) {
        redirect('/login')
    }
    
    return { isAuth: true, user_id: Number(session.user_id) }   
}

export const updateSession = async () => {
    const session = cookies().get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) return null

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
      });
}

export const deleteSession = async () => {
    cookies().delete('session')
    redirect('/login')
}