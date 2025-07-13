import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

import { authHandler } from '$lib/server/auth'
import { protectHandler } from '$lib/server/auth'

export const handle: Handle = sequence(authHandler, protectHandler)
