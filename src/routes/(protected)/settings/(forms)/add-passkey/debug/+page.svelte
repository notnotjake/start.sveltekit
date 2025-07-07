<script lang="ts">
	import { onMount } from 'svelte'
	import RegisterPasskey from '$bits/auth/passkey-register.svelte'

	let debugInfo = $state<any>(null)
	let error = $state<string>('')

	onMount(async () => {
		try {
			const response = await fetch('/auth/passkey-register/debug')
			if (response.ok) {
				debugInfo = await response.json()
			} else {
				error = `Failed to get debug info: ${response.status}`
			}
		} catch (e) {
			error = `Error: ${e instanceof Error ? e.message : 'Unknown error'}`
		}
	})
</script>

<div class="debug-page">
	<h2>Passkey Registration Debug</h2>
	
	{#if error}
		<div class="error" style="color: red; margin: 10px 0;">
			{error}
		</div>
	{/if}

	{#if debugInfo}
		<div class="debug-info" style="background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px;">
			<h3>Configuration</h3>
			<pre>{JSON.stringify(debugInfo, null, 2)}</pre>
		</div>
	{/if}

	<div class="passkey-test">
		<h3>Test Passkey Registration</h3>
		<RegisterPasskey name="Test Passkey" />
	</div>
</div>

<style>
	.debug-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
	}

	.debug-info pre {
		white-space: pre-wrap;
		word-break: break-all;
	}
</style> 