import { env } from '$env/dynamic/private'
import { PUBLIC_URL_BASE } from '$env/static/public'
import { CONSOLE_ONLY } from '.'
import { Resend } from 'resend'

import { expirationString } from './exp-string'
import { StructuredResponse as Response } from '$utils/structured-response'

import LoginEmail from './templates/login-email'
const RESEND_AUTH = env.RESEND_AUTH

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
