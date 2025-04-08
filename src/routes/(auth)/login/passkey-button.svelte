<script lang="ts">
	import { createClass } from '$utils/create-class'
	import { Suspense } from '$ui/feedback'
	import PasskeyIcon from '$ui/icons/passkey.svelte'
	let isActivating = $state(false)
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<button
		type="button"
		onclick={() => {
			isActivating = !isActivating
		}}
		class="relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-2 rounded-[0.9rem] border-none bg-neutral-800 px-4 font-medium text-white outline-none"
	>
		{#if isActivating}
			<Suspense.Spinner size={14} thickness={10} />
			<Suspense.Text
				class="text-sm"
				spread={13}
				colorBase="var(--color-neutral-200)"
				colorHighlight="var(--color-white)">Waiting for Authenticator...</Suspense.Text
			>
		{:else}
			<PasskeyIcon />
			Sign in with Passkey
		{/if}
	</button>
</div>
