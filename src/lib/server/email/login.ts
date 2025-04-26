import { PUBLIC_URL_BASE, PUBLIC_NODE_ENV } from '$env/static/public'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'
import LoginEmail from './templates/login-email'
import { expirationString } from './exp-string'

const RESEND_AUTH = env.RESEND_AUTH

import { StructuredResponse as Response } from '$utils/structured-response'

const CONSOLE_ONLY = PUBLIC_NODE_ENV === 'development'

export async function login({
	email,
	token,
	newAccount = false,
	timezone = 'UTC',
	maxAgeMins = 5
}: {
	email: string
	token: string
	newAccount?: boolean
	timezone: string
	maxAgeMins?: number
}): Promise<Response<never>> {
	const resend = new Resend(RESEND_AUTH)

	const url = `${PUBLIC_URL_BASE}/login?magic=${token}`

	const expiresAtString = expirationString(maxAgeMins, timezone)

	if (CONSOLE_ONLY) {
		console.log('Simulated Email - Magic Link:', url)
		return Response.succeed()
	}

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: newAccount ? 'Verify Email' : 'Login Link',
		react: LoginEmail({
			newAccount,
			url,
			maxAgeMins,
			expiresAtString
		})
	})

	if (error) {
		console.log(error)
		return Response.fail()
	}

	return Response.succeed()
}
