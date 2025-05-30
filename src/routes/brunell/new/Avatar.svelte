<!-- Avatar.svelte -->
<script>
	let { initials, size = 8, idx } = $props()

	const colors = [
		'bg-rose-400',
		'bg-amber-400',
		'bg-emerald-400',
		'bg-sky-400',
		'bg-violet-400',
		'bg-fuchsia-400'
	]

	const colorFor = (i) => colors[i % colors.length]
</script>

<div
	class="flex shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white {colorFor(
		idx
	)} h-{size} w-{size}"
>
	{initials}
</div>
