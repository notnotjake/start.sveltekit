<script>
	let { children } = $props()
</script>

<div class="flex h-auto min-h-0 justify-center">
	{@render children?.()}
</div>
