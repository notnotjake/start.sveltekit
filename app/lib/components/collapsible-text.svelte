<script lang="ts">
	import { createClass } from '$utils/create-class'
	let { children, isCollapsed = false } = $props()

	let elementWidth = $state(false)
</script>

<div
	style:width={isCollapsed ? '0px' : `${elementWidth}px`}
	style:opacity={elementWidth ? '1.0' : '0.0'}
	class="relative h-7 overflow-hidden transition-all delay-50 duration-250"
>
	<div
		bind:offsetWidth={elementWidth}
		class={createClass(
			'absolute top-0 left-0 flex h-full items-center px-2.5 whitespace-nowrap transition-all duration-200',
			isCollapsed ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
		)}
	>
		{@render children()}
	</div>
</div>
