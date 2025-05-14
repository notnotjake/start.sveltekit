<script>
	let { children } = $props()
</script>

<div class="relative h-full min-h-[100dvh] w-full bg-neutral-100">
	<div
		class="absolute top-0 left-0 z-0 h-[50vh] w-full bg-gradient-to-b from-[#F0F2F9] to-neutral-100"
	></div>
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
