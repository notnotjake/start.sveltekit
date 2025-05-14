import { goto } from '$app/navigation'

const REDIRECT_AFTER_LOGOUT = '/'

export async function handleLogout() {
	const response = await fetch('/auth/logout', {
		method: 'POST'
	})

	const result = await response.json()

	if (!result?.success) {
		console.log('show error')
	}

	if (result?.success === true) {
		goto(REDIRECT_AFTER_LOGOUT)
	}
}
