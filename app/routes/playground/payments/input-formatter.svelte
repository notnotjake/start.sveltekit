<script>
	export let value = ''
	export let pattern = { count: 4, token: '-', repeat: 4 }
	export let placeholder = ''
	export let nextRef = null

	let formatted = ''

	$: maxLength = pattern.count * pattern.repeat

	function handleInput(e) {
		// Remove all non-digits and any separators
		const newValue = e.target.value.replace(/[^\d]/g, '')

		if (newValue.length <= maxLength) {
			value = newValue

			// Check if we just completed a group (but not the final group)
			if (
				newValue.length % pattern.count === 0 &&
				newValue.length < maxLength &&
				e.target.selectionStart === e.target.value.length
			) {
				// Insert the token right away
				e.target.value = formatValue(newValue) + pattern.token
			}

			if (newValue.length === maxLength && nextRef) {
				nextRef.focus()
			}
		}
	}

	function formatValue(val) {
		let result = ''

		// Split the string into chunks of size pattern.count
		for (let i = 0; i < val.length; i += pattern.count) {
			const chunk = val.slice(i, i + pattern.count)
			result += chunk

			// Add separator if this isn't the last chunk and we have more numbers
			if (i + pattern.count < val.length) {
				result += pattern.token
			}
		}

		return result
	}

	$: formatted = formatValue(value)
</script>

<input {placeholder} value={formatted} on:input={handleInput} />
