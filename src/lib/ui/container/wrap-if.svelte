<script lang="ts">
	import type { Snippet } from 'svelte'
	import { createClass } from '$utils/create-class'

	// Component Props
	type Props = {
		children?: Snippet
		wrapWith: Snippet<[{ children: Snippet }]>
		condition: boolean
		class?: string
	}
	let { children, wrapWith, condition, class: classProp }: Props = $props()
</script>

{#if condition}
	{@render wrapWith({ children })}
{:else}
	{@render children?.()}
{/if}
