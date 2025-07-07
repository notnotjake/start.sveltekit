import { sendEmail, type EmailSendResponse } from '../send-email'
import { StructuredResponse as Response } from '$utils/structured-response'

import AlertEmailChanged from './templates/alert-email-changed'

export async function alertEmailChanged({
	email,
	newEmail
}: {
	email: string
	newEmail: string
}): Promise<EmailSendResponse> {
	const result = await sendEmail(
		{
			from: 'LightDance <accounts@resend.notnotjake.com>',
			to: email,
			subject: 'Email Changed',
			react: AlertEmailChanged({ newEmail })
		},
		`Email changed. FROM:${email} | TO:${email}`
	)

	if (result?.success) {
		return Response.succeed(result?.data)
	} else {
		return Response.fail()
	}
}

export async function confirmEmailChange() {}

export async function loginExistingUserWithCode() {}

export async function loginExistingUserWithLink() {}

export async function loginNewUserWithCode() {}

export async function loginNewUserWithLink() {}

export async function verifyWithCode() {}

export async function verifyWithLink() {}
