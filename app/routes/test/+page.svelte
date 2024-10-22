<script lang="ts">
	import { page } from '$app/stores'

	import Counter from '$ui/counter.svelte'

	let loadedDataSimple = $page.data.sample

	let count: Number = $state(0)

	function addOne(): Void {
		count += 1
	}

	function subtractOne(): Void {
		count -= 1
	}

	let double: Number = $derived(count * 2)
</script>

<h2 class="py-2 text-center">Hello, this is another page.</h2>

<div class="mx-auto max-w-lg rounded-lg bg-slate-100 px-4 py-2">
	<Counter {count} />

	{@render button('Add', addOne)}
	{@render button('Subtract', subtractOne)}

	<p>Double That = {double}</p>
</div>

<p>PageData = {loadedDataSimple}</p>

{#snippet button(text, callback)}
	<button
		onclick={callback}
		class="rounded-md bg-sky-100 px-2 py-0.5 text-sky-500 transition-all duration-100 hover:bg-sky-200 hover:text-sky-700 active:bg-sky-500 active:text-sky-50"
		>{text}</button
	>
{/snippet}
