'use client'

import { login } from "@/auth/01-auth";
import ErrorText from "@/components/error-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function Login (){
    const [ state, action ] = useFormState(login, undefined) 

    return (
        <form action={action}>
            <div className="border w-96 rounded-md p-10 space-y-4">
                <h1 className="text-2xl text-center">
                    Login
                </h1>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="your@gmail.com" required />
                    {state?.errors?.email && (
                        <ErrorText label={state.errors.email} />
                    )}
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="yourpassword" required />
                    {state?.errors?.password && (
                        <ErrorText label={state.errors.password} />
                    )}
                </div>

                {state?.message && (
                    <ErrorText label={state.message} />
                )}

                <div className="text-xs">
                    Don&apos;t have an account?{' '}
                    <Link href={'/register'} className="text-sky-500 underline">
                        Register
                    </Link>
                </div>

                <div className="flex justify-center">
                    <SubmitButton/>
                </div>
            </div>
        </form>
    )
}

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button className="w-full" type="submit" aria-disabled={pending}>
            { pending ? '...' : 'Login' }
        </Button>
    )
}