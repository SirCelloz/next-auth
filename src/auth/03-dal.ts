import { cache } from "react";
import { verifySession } from "./02-stateless-session";
import { db } from "../../prisma/db";

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    try {
        const user = await db.user.findUnique({ where: { id: session.user_id } })
        return user
    } catch (error) {
        console.log('Failed to fetch user');
        return null
    }
})