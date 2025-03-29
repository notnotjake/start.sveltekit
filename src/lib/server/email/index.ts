import { login } from './login'
import { StructuredResponse as Response } from '$utils/structured-response'

const SendMail = {
	async register(
		email: string, 
		token: string, 
		timezone: string = 'UTC', 
		maxAgeMins: number = 10
	): Promise<Response<never>> {
		return login(email, token, true, timezone, maxAgeMins)
	},
	async magiclink(
		email: string, 
		token: string, 
		timezone: string = 'UTC', 
		maxAgeMins: number = 10
	): Promise<Response<never>> {
		return login(email, token, false, timezone, maxAgeMins)
	}
}

export default SendMail
