'use client'

import { logout } from "@/auth/01-auth";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    return (
        <div>
            dashboard
            <Button onClick={async () => await logout()}>
                Logout
            </Button>
        </div>
    )
}
