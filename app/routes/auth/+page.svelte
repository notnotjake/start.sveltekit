<script lang="ts">
	import type { ActionData } from './$types'

	export let form: ActionData
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Auth Testing Page</h1>

	<form method="POST" action="?/createTestSession">
		<button class="rounded bg-blue-500 px-4 py-2 text-white"> Create Test Session </button>
	</form>

	{#if form}
		<div class="mt-4">
			<h2 class="mb-2 text-xl font-semibold">Result:</h2>
			{#if form.success}
				<div class="space-y-2">
					<!-- <p><strong>User ID:</strong> {form.data.userId}</p> -->
					<p><strong>Session Token:</strong> {form.data.token}</p>
					<p><strong>Session ID (hashed):</strong> {form.data.sessionId}</p>
					<!-- <p><strong>Expires At:</strong> {form.data.session.expiresAt}</p> -->
				</div>
			{:else}
				<p class="text-red-500">Error!</p>
			{/if}
		</div>
	{/if}
</div>
