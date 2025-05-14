<script lang="ts">
	import Button from '$ui/input/button.svelte'
	import Chevron from '$ui/icon/chevron.svelte'

	let { children } = $props()
</script>

<div class="">
	<div class="flex w-full items-center justify-center py-4">
		<Button style="secondary" class="w-fit pl-2" href="/settings"><Chevron />Settings</Button>
	</div>

	{@render children()}
</div>
