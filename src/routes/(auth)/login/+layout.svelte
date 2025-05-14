<script lang="ts">
	import AdaptingContainer from '$ui/container/adapting.svelte'
	import HelpMenu from '$bits/auth/help.svelte'
	let { children } = $props()

	let sitename = 'Luxo Co'
</script>

<div
	class="relative flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll bg-white"
>
	<a
		class="tracking-tight-md z-50 mx-auto block pt-2 text-center text-base font-medium text-black/55 no-underline transition-all duration-300 hover:text-black/85"
		href="/">{sitename}</a
	>

	{@render children()}

	{@render footer()}
</div>

{#snippet footer()}
	<div class="mx-auto mb-6 flex w-fit flex-row gap-4 rounded-full px-6 py-3 sm:gap-6">
		<HelpMenu />

		<a
			href="/privacy"
			class="px-2.5 py-1 text-[0.85rem] tracking-tight text-neutral-500 hover:text-black hover:underline"
			>Privacy</a
		>

		<a
			href="/terms"
			class="px-2.5 py-1 text-[0.85rem] tracking-tight text-neutral-500 hover:text-black hover:underline"
			>Terms</a
		>
	</div>
{/snippet}
