import { z } from 'zod'

type LogLevel = 'all' | 'errors' | 'none'

export function validateEnv<T extends z.ZodTypeAny>(
	envs: Record<string, unknown>,
	schema: T,
	logLevel: LogLevel = 'errors' // Defaults to logging only errors
): z.infer<T> {
	try {
		const validatedEnv = schema.parse(envs)

		if (logLevel === 'all') {
			console.log('[$lib/env] ✅ Environment variables validated successfully')
		}

		return validatedEnv
	} catch (error) {
		if (logLevel !== 'none' && error instanceof z.ZodError) {
			const missingVars = error.errors.map((err) => err.path.join('.'))
			console.error('[$lib/env] ⚠️ Invalid environment variables:', error.errors)
			console.error('[$lib/env] ⚠️ Missing or invalid variables:', missingVars.join(', '))
			throw new Error('[$lib/env] ⚠️ Invalid environment configuration')
		}
		throw error
	}
}
