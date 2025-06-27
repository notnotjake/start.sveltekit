<script>
	import TextInput from '$ui/input/text-input.svelte'

	let { job = $bindable() } = $props()
</script>

<div class="flex flex-col gap-2.5">
	<TextInput
		bind:value={job.name}
		withButton={false}
		containerClass="bg-neutral-200/70"
		placeholder="Name"
	/>
	<TextInput
		bind:value={job.location}
		withButton={false}
		containerClass="bg-neutral-200/70"
		placeholder="Location"
	/>
	<TextInput
		bind:value={job.customer}
		withButton={false}
		containerClass="bg-neutral-200/70"
		placeholder="Builder"
	/>
</div>
