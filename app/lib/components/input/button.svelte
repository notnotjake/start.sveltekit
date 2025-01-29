<script lang="ts">
	import { createClass } from '$utils/create-class'
	import SuspenseSpinner from '$ui/feedback/suspense-spinner.svelte'
	let { children, icon: Icon, suspense = false } = $props()
</script>

<div class="relative flex w-full shrink-1 grow basis-1 flex-col items-center">
	<button
		type="button"
		onclick={() => {
			suspense = !suspense
		}}
		class="hover:bg-neutral-150 relative m-auto flex h-11 w-full max-w-full cursor-pointer items-center justify-center gap-1 rounded-[0.9rem] border-none bg-neutral-100 px-4 font-[450] text-zinc-900 transition-colors duration-150 outline-none"
	>
		{#if suspense}
			<SuspenseSpinner size={'1rem'} />
		{:else}
			<Icon />
		{/if}
		{@render children()}
	</button>
</div>
