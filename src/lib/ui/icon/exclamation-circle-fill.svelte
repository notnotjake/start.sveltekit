<script lang="ts">
	type Props = {
		size?: string
		class?: string
	}
	let { size = '22px', class: classProp }: Props = $props()
</script>

<div class="inline-block" style="width: {size}; height: {size};">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 12 12"
		class={classProp}
		><path
			fill="currentColor"
			d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10m-.75-2.75a.75.75 0 1 1 1.5 0a.75.75 0 0 1-1.5 0m.258-4.84a.5.5 0 0 1 .984 0l.008.09V6l-.008.09a.5.5 0 0 1-.984 0L5.5 6V3.5z"
		/></svg
	>
</div>
