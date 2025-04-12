import { z } from 'zod'

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(8, 'Too Short, min 8').max(64, 'Too Long, max 64'),
	newPassword: z.string().min(8, 'Too Short, min 8').max(64, 'Too Long, max 64')
})
