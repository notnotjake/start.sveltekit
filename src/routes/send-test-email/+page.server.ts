import type { Actions } from './$types'
import { Resend } from 'resend'
import { RESEND_API } from '$env/static/private'

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Login Verification</title>
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
								Login
							</h2>
							<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; font-weight: 380; line-height: 1.4; color: #333;">
								If you didn't try to login, you can safely ignore this email
							</p>
						</td>
					</tr>
					<tr>
						<td style="padding: 28px 14px 12px 14px;">
							<!-- Login Button -->
							<a href="/" style="display: block; width: 100%; height: 44px; line-height: 44px; background-color: #0066FF; color: #ffffff; text-decoration: none; text-align: center; border-radius: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 500; margin-bottom: 12px;">
								Click to Login
							</a>

							<!-- Code Display -->
							<div style="width: 100%; height: 44px; line-height: 44px; background-color: #e5e5e5; color: #71717a; text-align: center; border-radius: 14px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 14px; margin-bottom: 48px;">
								951-028
							</div>

							<!-- Footer Text -->
							<div style="text-align: center; margin-top: 48px;">
								<p style="margin: 0 0 4px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #404040;">
									This login will be available for 10 minutes
								</p>
								<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: rgba(60,60,60,0.9);">
									Expires at 12:13 PM
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

export const actions: Actions = {
	default: async () => {
		const resend = new Resend(RESEND_API)

		const { data, error } = await resend.emails.send({
			from: 'LightDance <accounts@resend.notnotjake.com>',
			to: ['lightdance.4217@litmusemail.com'],
			subject: 'Sign In Link',
			html: emailHtml
		})

		if (error) {
			return console.error(error)
		}

		console.log(data)
	}
}
