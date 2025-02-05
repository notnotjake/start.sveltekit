<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$lib/theme/icons/passkey.svelte'
	let isActivating = $state(false)
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<button
		type="button"
		onclick={() => {
			isActivating = !isActivating
		}}
		class="bg-neutral-150 relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] border-none px-4 text-zinc-900 outline-none"
	>
		{#if isActivating}
			<Suspense.Spinner />
			<Suspense.Text class="text-sm">Waiting for Authenticator...</Suspense.Text>
		{:else}
			<PasskeyIcon />
			Sign in with Passkey
		{/if}
	</button>
</div>
