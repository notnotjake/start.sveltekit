import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'
import { PUBLIC_URL_BASE } from '$env/static/public'

import { StructuredResponse as Response } from '$utils/structured-response'

export async function login(
	email: string,
	token: string,
	newAccount: boolean,
	timezone: string = 'UTC',
	maxAgeMins: number = 10
): Promise<Response<never>> {
	const resend = new Resend(RESEND_API)

	const magicLink = `${PUBLIC_URL_BASE}/login?magic=${token}`
	
	// Calculate expiration time based on maxAgeMins
	const expiresAt = new Date(Date.now() + maxAgeMins * 60 * 1000);
	
	// Format the expiration time in the user's timezone
	const timeFormatter = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		timeZone: timezone,
		hour12: true
	});
	
	// Get timezone abbreviation
	const timeZoneFormatter = new Intl.DateTimeFormat('en-US', {
		timeZoneName: 'short',
		timeZone: timezone
	});
	const timeZoneParts = timeZoneFormatter.formatToParts(expiresAt);
	const timeZoneAbbr = timeZoneParts.find(part => part.type === 'timeZoneName')?.value || '';
	
	const formattedExpirationTime = timeFormatter.format(expiresAt);

	const emailHtml = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${newAccount ? 'Verify Email' : 'Login Link'}</title>
		<!--[if mso]>
		<style>
			table {border-collapse:collapse;border-spacing:0;margin:0;}
			div, td {padding:0;}
			div {margin:0 !important;}
		</style>
		<![endif]-->
	</head>
	<body style="margin: 0; padding: 0; width: 100%; background-color: #f5f5f5;">
		<table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f5f5f5; padding: 40px 0;">
			<tr>
				<td align="center">
					<!-- Header -->
					<a href="/" style="display: block; padding-top: 8px; margin-bottom: 40px; color: rgba(0,0,0,0.55); text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 500; text-align: center;">
						Art Fellowship
					</a>
	
					<!-- Main Container -->
					<table role="presentation" cellpadding="0" cellspacing="0" style="width: 368px; background-color: white; border-radius: 20px; padding: 8px;">
						<tr>
							<td style="padding: 20px 28px;">
								<h2 style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 550; line-height: 1.6;">
									${newAccount ? 'Create Account' : 'Login'}
								</h2>
								<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 380; line-height: 1.4; color: #333;">
									If you didn't try to login, you can safely ignore this email
								</p>
							</td>
						</tr>
						<tr>
							<td style="padding: 28px 14px 12px 14px;">
								<!-- Login Button -->
								<a href="${magicLink}" style="display: block; width: 100%; height: 44px; line-height: 44px; background-color: #0066FF; color: #ffffff; text-decoration: none; text-align: center; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 500; margin-bottom: 12px;">
									Click to Login
								</a>
	
								<!-- Code Display -->
								<div style="width: 100%; height: 44px; line-height: 44px; background-color: #e5e5e5; color: #71717a; text-align: center; border-radius: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 14px; margin-bottom: 48px;">
									951-028
								</div>
	
								<!-- Footer Text -->
								<div style="text-align: center; margin-top: 48px;">
									<p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #404040;">
										This login will be available for ${maxAgeMins} minutes
									</p>
									<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: rgba(60,60,60,0.9);">
										Expires at ${formattedExpirationTime} ${timeZoneAbbr}
									</p>
								</div>
	
								<!-- Spacing -->
								<div style="height: 24px;"></div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
	</html>`

	const { error } = await resend.emails.send({
		from: 'LightDance <accounts@resend.notnotjake.com>',
		to: email,
		subject: newAccount ? 'Verify Email' : 'Login Link',
		html: emailHtml
	})

	if (error) {
		console.log(error)
		return Response.fail()
	}

	return Response.succeed()
}
