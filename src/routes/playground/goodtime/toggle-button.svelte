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

<button
	class="mx-auto flex w-fit cursor-pointer flex-col items-center justify-center rounded-lg {color} px-4 py-2"
	onclick={clickHandler}
>
	<p class="text-[1.05rem]/4 font-medium opacity-80 {colorText}">SAT</p>
	<p class="text-[1.6rem]/7 font-bold {colorText}">12</p>
</button>
