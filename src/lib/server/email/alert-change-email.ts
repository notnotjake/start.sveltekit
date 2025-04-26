import { env } from '$env/dynamic/private'
import { CONSOLE_ONLY } from '.'
import { Resend } from 'resend'

import { StructuredResponse as Response } from '$utils/structured-response'

import AlertChangeEmail from './templates/alert-change-email'
const RESEND_AUTH = env.RESEND_AUTH

export async function alertChangeEmail({
	email,
	newEmail
}: {
	email: string
	newEmail: string
}): Promise<Response<never>> {
	const resend = new Resend(RESEND_AUTH)

	if (CONSOLE_ONLY) {
		console.log('Simulated Email - Email Updated')
		return Response.succeed()
	}

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: 'Email Updated',
		react: AlertChangeEmail({
			newEmail
		})
	})

	if (error) {
		console.log(error)
		return Response.fail()
	}

	return Response.succeed()
}
