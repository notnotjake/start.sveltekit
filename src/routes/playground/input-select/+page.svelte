<script lang="ts">
	import TextInput from '$ui/input/text-input.svelte'
	import { inputSelectAll } from '$lib/attachments/input-select-all'

	let sample = $state('Safari')
</script>

<div class="flex w-full flex-col gap-4">
	<TextInput
		name="passkey-name"
		id="passkey-name"
		bind:value={sample}
		placeholder="Passkey Name"
		{@attach inputSelectAll}
	/>
</div>
