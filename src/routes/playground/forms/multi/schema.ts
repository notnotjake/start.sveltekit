import { z } from 'zod'

export const emailSchema = z.object({
	email: z.string().email('Email not valid')
})

export const passwordSchema = z.object({
	password: z.string().min(8, 'Too Short').max(64, 'Too Long')
})
