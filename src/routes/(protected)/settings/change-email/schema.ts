import { z } from 'zod'

export const changeEmailSchema = z.object({
	newEmail: z.string().email('Email Invalid'),
	timezone: z.string().optional()
})

export const confirmEmailCodeSchema = z.object({
	code: z.string().min(6, 'Code must be 6 characters').max(6, 'Code must be 6 characters')
})
