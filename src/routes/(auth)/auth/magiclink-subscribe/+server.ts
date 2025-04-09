import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ setHeaders }) => {
	// Set required headers for SSE
	setHeaders({
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive'
	})

	let intervalId: NodeJS.Timeout
	let timeoutId: NodeJS.Timeout
	let isControllerClosed = false // Add a flag to track controller state
	const MAX_ALIVE_MS = 10 * 1000 // 5 mins max duration

	// Create a readable stream
	const stream = new ReadableStream({
		start(controller) {
			// Send an initial message
			controller.enqueue('event: message\ndata: {"message": "Connected to SSE"}\n\n')

			// Example: Send a message every 5 seconds
			intervalId = setInterval(() => {
				// Only send if controller is still open
				if (!isControllerClosed) {
					try {
						const data = JSON.stringify({ time: new Date().toISOString() })
						controller.enqueue(`event: update\ndata: ${data}\n\n`)
					} catch (err) {
						// Handle any errors during enqueue
						console.error('Error sending SSE update:', err)
						clearInterval(intervalId)
					}
				}
			}, 5000)

			// Set timeout to close the connection
			timeoutId = setTimeout(() => {
				try {
					// Send a final message
					controller.enqueue('event: timeout\ndata: {"message": "Connection timeout"}\n\n')
					// Mark controller as closed before actually closing it
					isControllerClosed = true
					// Clear the interval first to prevent further enqueue attempts
					clearInterval(intervalId)
					// Then close the stream
					controller.close()
				} catch (err) {
					console.error('Error closing SSE stream:', err)
				}
			}, MAX_ALIVE_MS)

			// Clean up when connection closes
			return () => {
				clearInterval(intervalId)
				clearTimeout(timeoutId)
				isControllerClosed = true
				console.log('Server cleanup: SSE connection closed')
			}
		},
		cancel() {
			// This is called when the client closes the connection
			clearInterval(intervalId)
			clearTimeout(timeoutId)
			isControllerClosed = true
			console.log('Client disconnected from SSE')
		}
	})

	return new Response(stream)
}
