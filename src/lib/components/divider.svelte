<script lang="ts">
	import type Snippet from 'svelte'
	import { createClass } from '$utils/styles'
	import CollapsibleText from '$ui/collapsible-text.svelte'

	let {
		children,
		text,
		collapsibleText,
		isCollapsed = false
	}: {
		children: Snippet
		text?: string
		collapsibleText?: string
		isCollapsed?: boolean
	} = $props()
</script>

<div class="divider flex h-fit w-full items-center py-0">
	<div class="line h-[1px] w-full shrink-2 grow basis-1 rounded-full bg-neutral-200"></div>

	{#if collapsibleText}
		<CollapsibleText {isCollapsed}>
			<p class="px-1.5 text-[0.9rem] whitespace-nowrap text-neutral-600/90">{text}</p>
		</CollapsibleText>
	{:else if text}
		<p class="px-1.5 text-[0.9rem] whitespace-nowrap text-neutral-600/90">{text}</p>
	{/if}

	<div class="line h-[1px] w-full shrink-2 grow basis-1 rounded-full bg-neutral-200"></div>
</div>
