import { publicSchema } from '../../../../env.schema'
import * as public_env from '$env/static/public'
import { filterEnv } from './filter'
import { validateEnv } from './validate'

const envs = filterEnv(public_env, publicSchema) // Filters out non-application envs

export const env = validateEnv(envs, publicSchema) // Validates envs with zod based on supplied schema
