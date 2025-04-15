<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

	let messages: string[] = []
	let eventSource: EventSource | null = null

	onMount(() => {
		// Create EventSource connection to our endpoint
		eventSource = new EventSource('/auth/magiclink/code-subscribe')

		// Listen for the "message" event type
		eventSource.addEventListener('message', (event) => {
			const data = JSON.parse(event.data)
			messages = [...messages, `Message: ${data.message}`]
		})

		// Listen for the "update" event type
		eventSource.addEventListener('update', (event) => {
			const data = JSON.parse(event.data)
			messages = [...messages, `Update at: ${data.time}`]
		})

		// Listen for the "timeout" event
		eventSource.addEventListener('timeout', (event) => {
			const data = JSON.parse(event.data)
			messages = [...messages, `Timeout: ${data.message}`]
			stopSSE()
		})

		// Handle connection errors
		eventSource.onerror = (error) => {
			console.error('SSE Error:', error)
			// Optionally try to reconnect
		}
	})

	onDestroy(() => {
		// Clean up the connection when component unmounts
		if (eventSource) {
			stopSSE()
		}
	})

	function stopSSE() {
		if (eventSource) {
			eventSource.close()
			eventSource = null
			console.log('SSE connection closed')
		}
	}
</script>

<div>
	<h1>Server-Sent Events Demo</h1>
	<div class="messages">
		{#each messages as message}
			<div class="message">{message}</div>
		{/each}
	</div>
</div>

<button on:click={stopSSE}>Stop Connection</button>

<style>
	.messages {
		border: 1px solid #ccc;
		height: 300px;
		overflow-y: auto;
		padding: 10px;
	}
	.message {
		margin-bottom: 5px;
		padding: 5px;
		background-color: #f5f5f5;
	}
</style>
