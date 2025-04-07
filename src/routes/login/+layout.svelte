<script>
	import AdaptingContainer from '$ui/containers/adapting.svelte'
	let { children } = $props()
</script>

<div
	class="flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll bg-white"
>
	{@render title()}

	<div data-desc="container" class="mt-8 flex h-full flex-col items-center justify-center">
		<div
			data-desc="platter outer"
			class="flex min-h-40 w-[25rem] flex-shrink-0 flex-col items-center rounded-[1.8rem] p-[0.5rem] px-3.5"
		>
			{@render children?.()}
		</div>
	</div>

	{@render footer()}
</div>

{#snippet title(sitename = 'Luxo Circle')}
	<a
		class="tracking-tight-md mx-auto block pt-2 text-center text-base font-medium text-black/55 no-underline transition-all duration-300 hover:text-black/85"
		href="/">{sitename}</a
	>
{/snippet}

{#snippet footer()}
	<div class="mx-auto mb-6 flex w-fit flex-row gap-6 rounded-full px-6 py-3">
		<a
			href="/help"
			class="text-[0.85rem] tracking-tight text-neutral-500 hover:text-black hover:underline"
			>Help</a
		>
		<a
			href="/privacy"
			class="text-[0.85rem] tracking-tight text-neutral-500 hover:text-black hover:underline"
			>Privacy</a
		>
		<a
			href="/terms"
			class="text-[0.85rem] tracking-tight text-neutral-500 hover:text-black hover:underline"
			>Terms</a
		>
	</div>
{/snippet}
