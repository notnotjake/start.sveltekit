import { envSchema } from '../../../../env.schema'
import { getEnvs } from './get-envs'
import { filterEnv } from './filter'
import { validateEnv } from './validate'

const process_env = getEnvs()

const envs = filterEnv(process_env, envSchema) // Filters out non-application envs

export const env = validateEnv(envs, envSchema) // Validates envs with zod based on supplied schema
