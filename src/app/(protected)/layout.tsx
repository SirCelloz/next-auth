import { verifySession } from "@/auth/02-stateless-session"
import { getUser } from "@/auth/03-dal"

export default async function ProtectedLayout ({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await verifySession()
    
    return (
        <div>
            { children }
        </div>
    )
}