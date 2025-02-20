import { z } from 'zod'

export const newUser = z.object({
	name: z.string().min(5, 'Name is too short'),
	email: z.string().email('Email not accepted'),
	jobTitle: z.string().min(2, 'Job title is too short')
})