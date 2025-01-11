import { config } from 'dotenv'
import { existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Loads and merges environment variables from layered .env files in the correct order.
 * - `.env` (base values)
 * - `.env.{NODE_ENV}` (environment-specific overrides)
 * - `.env.local` (local overrides, highest priority)
 */
export function getEnvs(): Record<string, string> {
	// Object to store merged (layered) env vars
	const mergedEnv: Record<string, string> = {}

	// Get base envs from .env including NODE_ENV if exists
	const base_env = config()
	if (base_env.parsed) {
		Object.assign(mergedEnv, base_env.parsed)
	}

	// Define file priority order (lower to higher priority)
	const envFiles = [
		`.env.${mergedEnv.NODE_ENV || 'development'}`, // Environment-specific overrides
		'.env.local' // Local overrides (highest priority)
	]

	// Load each file and merge the values in the correct order
	envFiles.forEach((file) => {
		const filePath = resolve(process.cwd(), file)

		if (existsSync(filePath)) {
			// Load the env file into process.env temporarily
			const result = config({ path: filePath })

			// Merge variables manually (later files overwrite earlier ones)
			if (result.parsed) {
				Object.assign(mergedEnv, result.parsed)
			}
		}
	})

	// Set the merged environment variables back to process.env
	Object.assign(process.env, mergedEnv)

	// Return the merged env object
	return mergedEnv
}
