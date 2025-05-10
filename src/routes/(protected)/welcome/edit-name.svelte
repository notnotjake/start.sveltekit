<script lang="ts">
	import TextInput from '$ui/input/text-input.svelte'
</script>

<div class="my-4 flex w-full flex-col">
	<label for="name" class="mb-1 px-2 text-[0.95rem] font-medium tracking-tight text-neutral-500"
		>What can we call you?</label
	>
	<TextInput id="name" placeholder="Johnny Appleseed" />
</div>
