<script lang="ts">
	import { tick } from 'svelte'

	let value = $state('')
	let inputElement = $state()
	let pattern = '(###) ### ####'
	let formatted = $state('')

	function isNumber(char: string): boolean {
		return /^\d$/.test(char)
	}
	function isLetter(char: string): boolean {
		return /^[a-zA-Z]$/.test(char)
	}

	let isFormatting = $state(false)
	$effect(async () => {
		if (!isFormatting) {
			const newFormatted = format(value)
			if (newFormatted !== value) {
				isFormatting = true
				let cursor = inputElement.selectionStart
				value = newFormatted
				await tick()
				inputElement.selectionStart = cursor
				inputElement.selectionEnd = cursor
				isFormatting = false
			}
		}
	})

	function cursorTest() {
		inputElement.selectionStart = 3
		inputElement.selectionEnd = 3
	}

	function format(val: string): string {
		if (!val) return ''

		let formattedValue = ''
		let valIdx = 0 // pointer for the input value
		let patIdx = 0 // pointer for the pattern

		// Process both strings until we run out of input...
		while (patIdx < pattern.length && valIdx < val.length) {
			const patChar = pattern[patIdx]
			const inputChar = val[valIdx]

			if (patChar === '#') {
				// Placeholder: digit required
				if (/\d/.test(inputChar)) {
					formattedValue += inputChar
					patIdx++
					valIdx++
				} else {
					// Skip the input character that isn’t a digit.
					valIdx++
				}
			} else if (patChar === '%') {
				// Placeholder: letter required
				if (/[a-zA-Z]/.test(inputChar)) {
					formattedValue += inputChar
					patIdx++
					valIdx++
				} else {
					// Skip input char if not a letter.
					valIdx++
				}
			} else if (patChar === '*') {
				// Placeholder: any character allowed
				formattedValue += inputChar
				patIdx++
				valIdx++
			} else {
				// Literal character in the pattern.
				if (inputChar === patChar) {
					// If the user already typed this literal, just copy it.
					formattedValue += inputChar
					patIdx++
					valIdx++
				} else {
					// Otherwise insert the literal from the pattern.
					formattedValue += patChar
					patIdx++
					// Note: we do not advance `valIdx` here so that the same inputChar
					// is used for the next pattern position.
				}
			}
		}

		// If there are leftover literal characters in the pattern, append them.
		while (patIdx < pattern.length) {
			const patChar = pattern[patIdx]
			// Only append if it’s a literal; stop at the next placeholder.
			if (patChar === '#' || patChar === '%' || patChar === '*') {
				break
			}
			formattedValue += patChar
			patIdx++
		}

		return formattedValue
	}
</script>

<div class="relative h-fit w-fit">
	<input
		type="text"
		bind:this={inputElement}
		bind:value
		placeholder="Card •••• ••••"
		maxlength="16"
		class="min-w-0 pl-4 outline-none focus:placeholder:text-neutral-900"
	/>
</div>

<button onclick={cursorTest}>Format</button>
