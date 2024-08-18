'use server'

import { db } from "../../prisma/db"
import { createSession, deleteSession } from "./02-stateless-session"
import { FormState, LoginFormSchema, RegisterFormSchema } from "./definition"
import bcrypt from 'bcrypt'

export const register = async (state: FormState, formData: FormData): Promise<FormState> => {

    // 1. Validate form fields
    const validatedFields = RegisterFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    }) 

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors }

    // 2. Prepare data for insertion into database
    const { name, email, password } = validatedFields.data

    // 3. Check if the user is already exist.
    const existingEmail = await db.user.findUnique({ where: { email: email } })

    if (existingEmail) return { message: 'User already exist, please use a different email.' }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    })

    await createSession(user.id)
}

export const login = async (state: FormState, formData: FormData): Promise<FormState> => {
    
    // 1. Validate form fields
    const validatedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    const errorMessage = { message: 'Invalid Login Credentials.' }

    if (!validatedFields.success) return { errors: validatedFields.error.flatten().fieldErrors }

    // 2. Query for the user with the given email
    const user = await db.user.findUnique({
        where: { email: validatedFields.data.email }
    })

    if (!user) return errorMessage

    const passwordMatch = await bcrypt.compare(
        validatedFields.data.password,
        user.password
    )

    if (!passwordMatch) return errorMessage

    await createSession(user.id)
}

export const logout = async () => {
    deleteSession()
}