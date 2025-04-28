import type { Actions, ServerLoad } from '@sveltejs/kit'
import { fail, redirect } from '@sveltejs/kit'

import Auth from '$lib/server/auth'

import { getUserKeysOfType } from '$lib/server/auth/users'

export const load: ServerLoad = async (event) => {
	const user = await Auth.protect.requireAuthenticatedUser(event)

	const passkeysReturned = await getUserKeysOfType({ userId: user.id, keyType: 'passkey' })

	let passkeys = null

	if (!passkeysReturned.success || !passkeysReturned.data) {
		console.log('something went wrong getting passkeys')
	} else {
		passkeys = passkeysReturned.data
	}

	return { passkeys: passkeys }
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
