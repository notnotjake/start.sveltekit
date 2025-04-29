import type { Actions, ServerLoad } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

import { getUserKeysOfType } from '$lib/server/auth/users'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	const sessionsReturned = await Auth.listAllUserSessions(user.id)

	if (!sessionsReturned || !sessionsReturned.data) {
		return fail(400)
	}

	const sessions = sessionsReturned.data.map((session) => ({
		ipAddress: session.ipAddress,
		userAgent: session.userAgent,
		lastSeenAt: session.lastSeenAt,
		invalidatedAt: session.invalidatedAt
	}))

	const activeSessions = sessions.filter((session) => !session.invalidatedAt)
	const invalidatedSessions = sessions
		.filter((session) => session.invalidatedAt)
		.sort((a, b) => b.invalidatedAt?.getTime() - a.invalidatedAt?.getTime())

	return { activeSessions, invalidatedSessions }
}

export const actions: Actions = {
	editPasskeyName: async (event) => {
		// get key id
		// update passkey name
	},
	removePasskey: async (event) => {
		// get key id
		// remove passkey
	}
}
