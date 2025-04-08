import { z } from 'zod'

export const emailSchema = z.object({
	email: z.string().email('Email Invalid'),
	timezone: z.string().optional()
})

export const passwordLoginSchema = z.object({
	email: z.string().email('Email Invalid'),
	password: z.string().min(3, 'Too Short').max(64, 'Too Long')
})
