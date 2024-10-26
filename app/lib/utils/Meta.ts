let messages: Array<string> = []

export function AddMessage(message: string) {
	const returnMessage = 'Success: ' + message

	messages.push(`
	<p>${returnMessage}</p>
	`)
}

export function LoadMessages(): string {
	console.log(messages)
	return messages.join('')
}
