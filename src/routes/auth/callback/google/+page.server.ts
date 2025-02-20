import type { PageServerLoad } from './$types'
import { OAUTH_GOOGLE_SECRET } from '$env/static/private'
import { PUBLIC_OAUTH_GOOGLE_CLIENTID } from '$env/static/public'

interface TokenResponse {
	access_token: string
	id_token: string
	refresh_token?: string
	expires_in: number
	token_type: string
	scope: string
}
interface GoogleUserInfo {
	id: string
	email: string
	verified_email: boolean
	name: string
	given_name: string
	family_name: string
	picture: string
	locale: string
}

export const load: PageServerLoad = async (event) => {
	const clientId = PUBLIC_OAUTH_GOOGLE_CLIENTID
	const clientSecret = OAUTH_GOOGLE_SECRET
	const redirectURI = 'http://localhost:5173/auth/callback/google'

	const storedState = event.cookies.get('google_oauth_state') ?? null
	const codeVerifier = event.cookies.get('google_oauth_verifier') ?? null

	const code = event.url.searchParams.get('code')
	const state = event.url.searchParams.get('state')

	if (storedState === null || codeVerifier === null || code === null || state === null) {
		return { status: 'Error: Please restart the process', name: null, identifier: null }
	}
	if (storedState !== state) {
		return { status: 'Error: Please restart the process', name: null, identifier: null }
	}

	try {
		const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code,
				client_id: clientId,
				client_secret: clientSecret,
				redirect_uri: redirectURI,
				grant_type: 'authorization_code',
				code_verifier: codeVerifier
			})
		})

		if (!tokenResponse.ok) {
			const error = await tokenResponse.text()
			console.error('Token exchange error:', error)
			return { status: 'Error: Failed to exchange code for tokens', name: null, identifier: null }
		}

		const tokens: TokenResponse = await tokenResponse.json()

		const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		})

		if (!userInfoResponse.ok) {
			const error = await userInfoResponse.text()
			console.error('User info error:', error)
			return { status: 'Error: Failed to get user information', name: null, identifier: null }
		}

		const userInfo: GoogleUserInfo = await userInfoResponse.json()

		event.cookies.delete('google_oauth_state', { path: '/' })
		event.cookies.delete('google_code_verifier', { path: '/' })

		console.log('success')
		console.log(userInfo)

		return {
			name: userInfo.name,
			identifier: userInfo.email
		}
	} catch (error) {
		console.error('OAuth callback error:', error)
		return { status: 'Error', name: null, identifier: null }
	}
}
