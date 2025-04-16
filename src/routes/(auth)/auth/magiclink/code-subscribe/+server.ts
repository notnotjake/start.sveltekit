import type { RequestHandler } from '@sveltejs/kit'
import { appEventEmitter } from '$lib/server/auth/event'

export const GET: RequestHandler = async ({ setHeaders, locals }) => {
	console.log('SSE connection initialized')

	// Set required headers for SSE
	setHeaders({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	})

	appEventEmitter.removeAllListeners(locals.session.id)

	let timeoutId: NodeJS.Timeout
	let isControllerClosed = false // Flag to track controller state
	const MAX_ALIVE_MS = 5 * 60 * 1000 // 5 minutes max duration

	// Define the handler for the code available event outside stream context
	// so it can be accessed in both start and cancel methods
	let notifyCodeAvailable: () => void

	// Create a readable stream
	const stream = new ReadableStream({
		start(controller) {
			// Send an initial message to confirm connection
			controller.enqueue('event: message\ndata: {"message": "Connected to SSE"}\n\n')

			// Define the handler for the code available event
			notifyCodeAvailable = () => {
				console.log(`Code is available for session ${locals.session.id}`)
				if (!isControllerClosed) {
					try {
						const data = JSON.stringify({
							time: new Date().toISOString(),
							sessionId: locals.session.id
						})
						controller.enqueue(`event: code-available\ndata: ${data}\n\n`)

						// After sending the code-available event, we can close the connection
						// This is optional - you might want to keep it open if you need to send more events
						setTimeout(() => {
							if (!isControllerClosed) {
								isControllerClosed = true
								controller.close()
							}
						}, 1000)
					} catch (err) {
						// Handle any errors during enqueue
						console.error('Error sending code-available event:', err)
					}
				}
			}

			// Listen for the specific event for this session
			appEventEmitter.on(locals.session.id, notifyCodeAvailable)

			// Set timeout to close the connection after MAX_ALIVE_MS
			timeoutId = setTimeout(() => {
				try {
					// Send a final message
					controller.enqueue(
						'event: timeout\ndata: {"message": "Connection timeout after 5 minutes"}\n\n'
					)
					// Mark controller as closed before actually closing it
					isControllerClosed = true
					// Then close the stream
					controller.close()
					// Remove the event listener
					appEventEmitter.off(locals.session.id, notifyCodeAvailable)
				} catch (err) {
					console.error('Error closing SSE stream:', err)
				}
			}, MAX_ALIVE_MS)

			// Define cleanup function for when connection closes
			return () => {
				// Remove the event listener
				appEventEmitter.off(locals.session.id, notifyCodeAvailable)
				clearTimeout(timeoutId)
				isControllerClosed = true
				console.log(`Server cleanup: SSE connection closed for session ${locals.session.id}`)
			}
		},
		cancel() {
			// This is called when the client closes the connection
			appEventEmitter.removeAllListeners(locals.session.id)
			clearTimeout(timeoutId)
			isControllerClosed = true
			console.log(`Client disconnected from SSE for session ${locals.session.id}`)
		}
	})

	return new Response(stream)
}
