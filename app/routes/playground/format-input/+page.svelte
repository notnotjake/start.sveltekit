<script lang="ts">
	import { formatInput } from '$lib/actions'

	let value = $state('')
	let pattern = '####-####-####-####'
</script>

<div class="relative h-fit w-fit">
	<input
		type="text"
		bind:value
		use:formatInput={pattern}
		placeholder="Card •••• ••••"
		class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
	/>
</div>
