<script>
	let { children } = $props()
</script>

<div class="flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll">
	{@render title()}

	<div data-desc="container" class="mt-20 mb-12 flex h-full flex-col items-center">
		<div
			data-desc="platter outer"
			class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-gradient-to-b from-[hsl(214,100%,96%)] to-[hsl(282,100%,98%)] p-[0.5rem]"
		>
			{@render cardHeading()}

			<div
				data-desc="platter inner"
				class="flex h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] bg-white px-3.5 pt-7 pb-3 shadow-xs"
			>
				{@render children?.()}
			</div>
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

{#snippet cardHeading(
	action = 'Start Creating',
	welcome = 'Connect with others and schedule practice with our vibrant community'
)}
	<div class="mb-2 px-7 py-5">
		<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">{action}</h2>
		<p class="tracking-tight-lg text-[0.96rem] leading-5 font-[380]">
			{welcome}
		</p>
	</div>
{/snippet}

{#snippet footer()}
	<div class="mx-auto mb-6 flex w-fit flex-row gap-8 rounded-full bg-[hsla(0,0%,97%,1)] px-6 py-3">
		<a
			href="/help"
			class="text-[0.95rem] tracking-tighter text-slate-800 hover:text-black hover:underline"
			>Help</a
		>
		<a
			href="/privacy"
			class="text-[0.95rem] tracking-tighter text-slate-800 hover:text-black hover:underline"
			>Privacy</a
		>
	</div>
{/snippet}
