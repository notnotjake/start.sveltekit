import { z } from 'zod'

export const privateSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),

	// Database
	DB_URL: z.string(),

	JWT_SECRET: z.string().min(32),
	CACHE_TTL: z.coerce.number().int().positive().default(3600)
})

export const publicSchema = z.object({
	PUBLIC_URL: z.string().url(),
	PUBLIC_URL_ASSETS: z.string().url(),
	PUBLIC_ANALYTICS: z.coerce.boolean()
})

export const combinedSchema = z.object({
	...privateSchema.shape,
	...publicSchema.shape
})

export type PrivateEnv = z.infer<typeof privateSchema>
export type PublicEnv = z.infer<typeof publicSchema>
export type CombinedEnv = z.infer<typeof combinedSchema>
