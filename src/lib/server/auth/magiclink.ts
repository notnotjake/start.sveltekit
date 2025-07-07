import Auth from '$lib/server/auth'
import SendEmail from '$lib/server/email'
import { StructuredResponse as Response } from '$utils/structured-response'

export async function sendMagiclink({
	email,
	sessionId,
	type,
	timezone = 'UTC'
}: {
	email: string
	sessionId: string
	type: 'login' | 'register'
	timezone?: string
}): Promise<Response<never>> {
	const token = Auth.generateToken()
	const maxAgeMins = 5

	try {
		if (type === 'login') {
			await SendEmail.account.loginExistingUserWithLink({ email, url: token, timezone, maxAgeMins })
		} else if (type === 'register') {
			await SendEmail.account.loginNewUserWithLink({ email, url: token, timezone, maxAgeMins })
		} else {
			return Response.fail('Invalid email type')
		}
	} catch (e) {
		console.error('Email sending error:', e)
		return Response.fail('Failed to send email')
	}

	try {
		await Auth.createAuthAttempt({
			type: 'email',
			identifier: email,
			sessionId,
			token,
			maxAgeMins
		})
	} catch (e) {
		console.error('Email sending error:', e)
		return Response.fail('Failed to send email')
	}

	return Response.succeed()
}

export async function sendCode({
	email,
	sessionId,
	type,
	timezone = 'UTC'
}: {
	email: string
	sessionId: string
	type: 'login' | 'register'
	timezone?: string
}): Promise<Response<never>> {
	const code = Auth.generateShortCode()
	const maxAgeMins = 5

	try {
		if (type === 'login') {
			await SendEmail.account.loginExistingUserWithCode({ email, code, timezone, maxAgeMins })
		} else if (type === 'register') {
			await SendEmail.account.loginNewUserWithCode({ email, code, timezone, maxAgeMins })
		} else {
			return Response.fail('Invalid email type')
		}
	} catch (e) {
		console.error('Email sending error:', e)
		return Response.fail('Failed to send email')
	}

	try {
		await Auth.createAuthAttempt({
			type: 'code',
			identifier: email,
			sessionId,
			token: code,
			maxAgeMins
		})
	} catch (e) {
		console.error('Email sending error:', e)
		return Response.fail('Failed to send email')
	}

	return Response.succeed()
}
