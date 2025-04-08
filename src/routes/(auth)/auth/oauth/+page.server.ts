import type { PageServerLoad } from './$types'
import { PUBLIC_OAUTH_GOOGLE_CLIENTID } from '$env/static/public'
import { createAuthorizationURL, generateTokens } from '$lib/server/auth/oauth'

export const load: PageServerLoad = async (event) => {
	const clientId = PUBLIC_OAUTH_GOOGLE_CLIENTID
	const redirectURI = 'http://localhost:5173/auth/callback/google'

	const oauthTokens = generateTokens()

	event.cookies.set('google_oauth_state', oauthTokens.state, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10,
		path: '/'
	})
	event.cookies.set('google_oauth_verifier', oauthTokens.verifier, {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 60 * 10,
		path: '/'
	})

	const authorizationURL = createAuthorizationURL(
		'https://accounts.google.com/o/oauth2/v2/auth',
		clientId,
		redirectURI,
		oauthTokens
	)

	return { authorizationURL, oauthTokens }
}
