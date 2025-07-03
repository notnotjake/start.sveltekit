<script lang="ts">
	import { createClass } from '$utils/styles'

	type Props = {
		size?: string
		class?: string
	}
	let { size = '22px', class: classProp }: Props = $props()
</script>

<div class={createClass(classProp, 'inline-block')} style="width: {size}; height: {size};">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path
			fill="currentColor"
			fill-rule="evenodd"
			d="M15.186 9.581a1 1 0 1 0-1.628-1.162l-4.314 6.04l-2.165-2.166a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.52-.126l5-7z"
			clip-rule="evenodd"
		/>
	</svg>
</div>
