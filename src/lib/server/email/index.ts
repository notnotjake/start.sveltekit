import { login } from './login'
import { StructuredResponse as Response } from '$utils/structured-response'

const SendMail = {
	async register(email: string, token: string): Promise<Response<never>> {
		return login(email, token, true)
	},
	async magiclink(email: string, token: string): Promise<Response<never>> {
		return login(email, token, false)
	}
}

export default SendMail
