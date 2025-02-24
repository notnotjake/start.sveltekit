import { z } from 'zod'

export function filterEnv<T extends z.ZodObject<any>>(
	envs: Record<string, unknown>,
	schema: T
): Record<string, string> {
	const envVars: Record<string, string> = {}

	// Filters environment variables to just those defined in our schema
	// Removes all the other variables that are in runtime's shell execution
	const APP_ENV_KEYS = Object.keys(schema.shape)
	for (const key of APP_ENV_KEYS) {
		if (key in envs) {
			envVars[key] = (envs as Record<string, string>)[key]
		}
	}

	return envVars
}
