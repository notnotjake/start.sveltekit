import { envSchema } from '../../../../env.schema'
import * as private_env from '$env/static/private'
import * as public_env from '$env/static/public'
import { filterEnv } from './filter'
import { validateEnv } from './validate'

const combined_env = { ...private_env, ...public_env } // Combines public and private envs

const envs = filterEnv(combined_env, envSchema) // Filters out non-application envs

export const env = validateEnv(envs, envSchema) // Validates envs with zod based on supplied schema
