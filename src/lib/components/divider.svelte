<script lang="ts">
	import { createClass } from '$utils/create-class'
	import CollapsibleText from '$ui/collapsible-text.svelte'
	let { children, text = '', isCollapsed = false } = $props()
</script>

<div class="divider flex w-full items-center py-0">
	<div class="line h-[1px] w-full shrink-2 grow basis-1 rounded-full bg-neutral-200"></div>

	{#if text !== ''}
		<CollapsibleText {isCollapsed}>
			<p class="text-[0.9rem] whitespace-nowrap text-neutral-600/90">Or Continue With</p>
		</CollapsibleText>
	{/if}

	<div class="line h-[1px] w-full shrink-2 grow basis-1 rounded-full bg-neutral-200"></div>
</div>
