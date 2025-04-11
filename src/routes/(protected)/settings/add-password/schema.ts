import { z } from 'zod'

export const passwordSchema = z.object({
	password: z.string().min(8, 'Too Short, min 8').max(64, 'Too Long, max 64')
})
