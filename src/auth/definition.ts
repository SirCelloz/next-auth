import { z } from "zod";

export const RegisterFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' })
        .trim(),
    password: z
        .string()
        .min(3, { message: 'Be at least 3 characters long.' })
        .trim()
})

export const LoginFormSchema = z.object({
    email: z
        .string()
        .email({ message: 'Please enter a valid email.' }),
    password: z
        .string()
        .min(1, { message: 'Password field must not be empty' })
})

export type FormState = 
    | {
        errors?: {
            name?: string[]
            email?:string[]
            password?: string[]
        }
        message?: string
    }
    | undefined

export type SessionPayload = {
    user_id: string | number
    expires: Date
}