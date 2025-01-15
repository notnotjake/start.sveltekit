<script>
	let { children } = $props()
</script>

<div
	class="flex h-full w-full flex-shrink-0 flex-col items-center justify-center overflow-scroll bg-gray-100"
>
	{@render children?.()}
</div>
