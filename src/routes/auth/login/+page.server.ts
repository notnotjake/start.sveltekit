import { redirect } from '@sveltejs/kit'
import * as auth from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ cookies, request }) => {
	return {}
}
