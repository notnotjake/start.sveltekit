import { env } from '$env/dynamic/private'
import { CONSOLE_ONLY } from '.'
import { Resend } from 'resend'

import { expirationString } from './exp-string'
import { StructuredResponse as Response } from '$utils/structured-response'

import LoginCodeEmail from './templates/login-code'
const RESEND_AUTH = env.RESEND_AUTH

export async function loginCode({
	email,
	code,
	newAccount = false,
	timezone = 'UTC',
	maxAgeMins = 5
}: {
	email: string
	code: string
	newAccount?: boolean
	timezone: string
	maxAgeMins?: number
}): Promise<Response<never>> {
	const resend = new Resend(RESEND_AUTH)

	const expiresAtString = expirationString(maxAgeMins, timezone)

	if (CONSOLE_ONLY) {
		console.log('Simulated Email - Login Code:', code)
		return Response.succeed()
	}

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: newAccount ? 'Verify Email' : 'Login Code',
		react: LoginCodeEmail({
			newAccount,
			code,
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