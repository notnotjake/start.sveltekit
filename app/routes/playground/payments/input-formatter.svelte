<script>
	export let value = ''
	export let pattern = { count: 2, token: '/', repeat: 2 }
	export let placeholder = ''
	export let nextRef = null

	let formatted = ''

	$: maxLength = pattern.count * pattern.repeat

	function handleInput(e) {
		const newValue = e.target.value.replace(/\D/g, '')

		if (newValue.length <= maxLength) {
			value = newValue

			// Check if we just completed a group (but not the final group)
			if (
				newValue.length % pattern.count === 0 &&
				newValue.length < maxLength &&
				e.target.selectionStart === e.target.value.length
			) {
				// Insert the token right away
				e.target.value = e.target.value + pattern.token
			}

			if (newValue.length === maxLength && nextRef) {
				nextRef.focus()
			}
		}
	}

	$: {
		let result = ''
		let pos = 0

		for (let i = 0; i < pattern.repeat && pos < value.length; i++) {
			result += value.slice(pos, pos + pattern.count)

			if (
				result.length === pattern.count * (i + 1) &&
				i < pattern.repeat - 1 &&
				value.length > pos + pattern.count
			) {
				result += pattern.token
			}

			pos += pattern.count
		}

		formatted = result
	}
</script>

<input {placeholder} value={formatted} on:input={handleInput} />
