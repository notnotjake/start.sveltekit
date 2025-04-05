<script lang="ts">
	import WrapIf from '$ui/containers/wrap-if.svelte'

	let ifTrue = $state(true)
</script>

<WrapIf condition={ifTrue}>
	{#snippet wrapWith({ children })}
		<div class="wrapper border-1 border-red-500">
			{@render children()}
		</div>
	{/snippet}

	<p>I am some child content</p>
</WrapIf>

<button
	onclick={() => {
		ifTrue = !ifTrue
	}}>Toggle</button
>
