<script lang="ts">
	let clicks = $state(0)
	function clickHandler() {
		if (clicks < 2) {
			clicks += 1
		} else {
			clicks = 0
		}
	}
	let color = $derived.by(() => {
		if (clicks === 0) {
			return 'bg-neutral-200'
		} else if (clicks === 1) {
			return 'bg-green-400'
		} else if (clicks > 1) {
			return 'bg-yellow-300/80'
		} else {
			return 'bg-red-300'
		}
	})
	let colorText = $derived.by(() => {
		if (clicks === 0) {
			return 'text-neutral-800'
		} else if (clicks === 1) {
			return 'text-green-900'
		} else if (clicks > 1) {
			return 'text-yellow-900'
		} else {
			return 'text-red-300'
		}
	})
</script>

<p></p>

<div class="flex flex-col gap-3">
	{@render tooltip('bg-neutral-200', 'No.', 'Default')}
	{@render tooltip('bg-green-400', 'Yes!', 'Click Once')}
	{@render tooltip('bg-yellow-300/80', 'Maybe', 'Click Twice')}
</div>

<div class="shadow-box my-4 h-40 w-70 rounded-[1.1rem] bg-white ring-2 ring-neutral-200/70">
	<h2 class="w-full pt-2 pb-4 text-center text-lg font-medium">Try It!</h2>

	<button
		class="mx-auto flex w-fit cursor-pointer flex-col items-center justify-center rounded-lg {color} px-4 py-2"
		onclick={clickHandler}
	>
		<p class="text-[1.05rem]/4 font-medium opacity-80 {colorText}">SAT</p>
		<p class="text-[1.6rem]/7 font-bold {colorText}">12</p>
	</button>
</div>

{#snippet tooltip(color, primaryText, secondaryText)}
	<div class="flex items-center gap-2">
		<div class="h-8 w-8 rounded-lg {color}"></div>
		<div>
			<p class="text-[0.9rem]/4 font-medium">{primaryText}</p>
			<p class="text-[0.75rem]/3 text-neutral-600">{secondaryText}</p>
		</div>
	</div>
{/snippet}
