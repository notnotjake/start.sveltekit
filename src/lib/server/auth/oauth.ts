import { generateToken, hashToken } from './utils'

type OAuthTokens = {
	state: string
	verifier: string
	challenge: string
}

const providerURLs = {
	google: 'https://accounts.google.com/o/oauth2/v2/auth',
	apple: 'https://accounts.apple.com/oauth'
}
const OAuthScopes = ['email', 'profile']

export function createAuthorizationURL(
	provider: string,
	clientId: string,
	redirectUri: string,
	tokens: OAuthTokens
): string {
	const url = new URL(provider)
	url.searchParams.append('client_id', clientId)
	url.searchParams.append('redirect_uri', redirectUri)
	url.searchParams.append('response_type', 'code')
	url.searchParams.append('scope', OAuthScopes.join(' '))
	url.searchParams.append('state', tokens.state)
	url.searchParams.append('code_challenge', tokens.challenge)
	url.searchParams.append('code_challenge_method', 'S256')

	return url.toString()
}

export function generateTokens(): OAuthTokens {
	const state = generateToken().replace(/=+$/, '')
	const verifier = generateToken().replace(/=+$/, '')
	const challenge = hashToken(verifier).replace(/=+$/, '')

	return { state, verifier, challenge }
}
