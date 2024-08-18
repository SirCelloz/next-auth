;'use client'

import { register } from "@/auth/01-auth";
import ErrorText from "@/components/error-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function Register (){
    const [ state, action ] = useFormState(register, undefined)

    return (
        <form action={action}>
            <div className="border w-96 rounded-md p-10 space-y-4">
                <h1 className="text-2xl text-center">
                    Register
                </h1>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input type="name" name="name" id="name" placeholder="yourname" required />
                </div>
                {state?.errors?.name && (
                    <ErrorText label={state.errors.name} />
                )}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" placeholder="your@gmail.com" required />
                </div>
                {state?.errors?.email && (
                    <ErrorText label={state.errors.email} />
                )}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" placeholder="yourpassword" required />
                </div>
                {state?.errors?.password && (
                    <div className="text-xs text-red-500">
                        <p>Password must:</p>
                        <ul>
                            {state.errors.password.map(error => (
                                <li key={ error }>
                                    { error }
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="text-xs">
                    Already have an account?{' '}
                    <Link className="text-sky-500 underline" href="/login">
                        Login
                    </Link>
                </div>

                <div className="flex justify-center">
                    <SubmitButton/>
                </div>
            </div>
        </form>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button className="w-full" type="submit" aria-disabled={pending}>
            { pending ? '...' : 'Register' }
        </Button>
    )
}