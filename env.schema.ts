import { z } from 'zod'

export const privateSchema = z.object({
	NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
	// Email with Resend
	RESEND_AUTH: z.string(),
	// Database
	DB_URL: z.string(),
	DB_TURSO_SYNC_URL: z.string().optional(),
	DB_TURSO_AUTH: z.string().optional()
})

export const publicSchema = z.object({
	PUBLIC_URL_BASE: z.string().url().optional().default(''),
	PUBLIC_URL_ASSETS: z.union([z.string().url(), z.literal('')]),
	PUBLIC_ANALYTICS: z.coerce.boolean()
})

export const envSchema = z.object({
	...privateSchema.shape,
	...publicSchema.shape
})

export type PrivateEnv = z.infer<typeof privateSchema>
export type PublicEnv = z.infer<typeof publicSchema>
