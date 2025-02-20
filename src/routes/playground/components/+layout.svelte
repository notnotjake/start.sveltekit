<script>
	let { children } = $props()
</script>

<div
	class="flex h-full w-full flex-shrink-0 flex-col items-center justify-start overflow-scroll bg-gradient-to-b from-[#2476FB] to-[#2679FA] py-10"
>
	<div class="max-w-85">
		{@render children?.()}
	</div>
</div>
