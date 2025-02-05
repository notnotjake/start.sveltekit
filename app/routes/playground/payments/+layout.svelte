<script>
	let { children } = $props()
</script>

<div
	class="flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll bg-neutral-100"
>
	<a
		class="tracking-tight-md mx-auto block pt-2 text-center text-base font-medium text-black/55 no-underline transition-all duration-300 hover:text-black/85"
		href="/">Luxo Circle</a
	>

	<div class="mt-14 mb-12 flex h-full flex-col items-center">
		<div
			class="flex min-h-40 w-[23rem] flex-shrink-0 flex-col rounded-[1.3rem] bg-white p-[0.5rem]"
		>
			{@render children?.()}
		</div>
	</div>
</div>
