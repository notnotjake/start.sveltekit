import { expirationString } from './exp-string'
import { PUBLIC_NODE_ENV } from '$env/static/public'
import { env } from '$env/dynamic/private'
import { Resend } from 'resend'
import ConfirmChangeEmail from './templates/confirm-change-email'
import { StructuredResponse as Response } from '$utils/structured-response'

const RESEND_AUTH = env.RESEND_AUTH

const CONSOLE_ONLY = PUBLIC_NODE_ENV === 'development'

export async function confirmChangeEmail({
	email,
	code,
	timezone = 'UTC',
	maxAgeMins = 5
}: {
	email: string
	code: string
	timezone?: string
	maxAgeMins?: number
}): Promise<Response<never>> {
	const resend = new Resend(RESEND_AUTH)

	const expiresAtString = expirationString(maxAgeMins, timezone)

	if (CONSOLE_ONLY) {
		console.log('Simulated Email - Confirmation Code:', code)
		return Response.succeed()
	}

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: 'Confirm New Email',
		react: ConfirmChangeEmail({
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
