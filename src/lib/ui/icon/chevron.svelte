<script lang="ts">
	let {
		size = '22px',
		class: classProp,
		direction = 'left'
	}: {
		size?: string
		class?: string
		direction?: 'left' | 'right' | 'up' | 'down'
	} = $props()

	let rotation = $derived.by(() => {
		if (direction === 'right') return 180
		else if (direction === 'up') return 90
		else if (direction === 'down') return 270
	})
</script>

<svg
	width={size}
	height={size}
	class={classProp}
	style:rotate={`${rotation}deg`}
	viewBox="0 0 32 32"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	><path
		d="M19 10L13 16L19 22"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	></path></svg
>
