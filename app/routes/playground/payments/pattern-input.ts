// Types
type PatternToken = '#' | '$' | '*'
type PatternChar = PatternToken | string

interface InputState {
	value: string
	pattern: string
	inputElement: HTMLInputElement | null
}

// Pattern Input logic
function createPatternInput() {
	let lastValue = ''
	let lastCursor = 0

	function isPatternToken(char: string): char is PatternToken {
		return char === '#' || char === '$' || char === '*'
	}

	function matchesPattern(char: string, patternChar: PatternChar): boolean {
		switch (patternChar) {
			case '#':
				return /^\d$/.test(char)
			case '$':
				return /^[A-Za-z]$/.test(char)
			case '*':
				return /^.$/.test(char)
			default:
				return char === patternChar
		}
	}

	function formatValue(value: string, pattern: string): string {
		let result = ''
		let valueIndex = 0

		for (let i = 0; i < pattern.length && valueIndex < value.length; i++) {
			const patternChar = pattern[i]

			if (isPatternToken(patternChar)) {
				// Add character from value if it matches pattern
				const char = value[valueIndex]
				if (matchesPattern(char, patternChar)) {
					result += char
					valueIndex++
				}
			} else {
				// Add literal character from pattern
				result += patternChar
			}
		}

		return result
	}

	function unformatValue(formattedValue: string, pattern: string): string {
		let result = ''
		let valueIndex = 0

		for (let i = 0; i < pattern.length && valueIndex < formattedValue.length; i++) {
			const patternChar = pattern[i]

			if (isPatternToken(patternChar)) {
				const char = formattedValue[valueIndex]
				if (matchesPattern(char, patternChar)) {
					result += char
				}
				valueIndex++
			} else {
				// Skip literal characters from pattern
				valueIndex++
			}
		}

		return result
	}

	function calculateCursorPosition(
		oldValue: string,
		newValue: string,
		oldCursor: number,
		pattern: string
	): number {
		// Count pattern tokens up to cursor in old value
		let oldTokenCount = 0
		let oldPatternIndex = 0

		for (let i = 0; i < oldCursor && oldPatternIndex < pattern.length; oldPatternIndex++) {
			if (isPatternToken(pattern[oldPatternIndex])) {
				if (i < oldValue.length) i++
				oldTokenCount++
			}
		}

		// Find position in new value that has the same token count
		let newCursor = 0
		let tokenCount = 0
		let patternIndex = 0

		while (tokenCount < oldTokenCount && patternIndex < pattern.length) {
			if (isPatternToken(pattern[patternIndex])) {
				tokenCount++
			}
			if (newCursor < newValue.length) newCursor++
			patternIndex++
		}

		return newCursor
	}

	function handleInput(event: Event, state: InputState) {
		const input = event.target as HTMLInputElement
		const newValue = input.value
		const cursorPos = input.selectionStart ?? 0

		// Store unformatted value
		const unformatted = unformatValue(newValue, state.pattern)

		// Format the value
		const formatted = formatValue(unformatted, state.pattern)

		// Calculate new cursor position
		const newCursor = calculateCursorPosition(lastValue, formatted, lastCursor, state.pattern)

		// Update the input
		input.value = formatted
		state.value = unformatted // This will trigger the binding update

		// Restore cursor position
		requestAnimationFrame(() => {
			input.setSelectionRange(newCursor, newCursor)
		})

		// Store values for next update
		lastValue = formatted
		lastCursor = newCursor
	}

	function handlePaste(event: ClipboardEvent, state: InputState) {
		event.preventDefault()

		const pastedText = event.clipboardData?.getData('text') ?? ''
		const input = event.target as HTMLInputElement
		const cursorPos = input.selectionStart ?? 0
		const selectionEnd = input.selectionEnd ?? cursorPos

		// Get current unformatted value
		const currentUnformatted = unformatValue(input.value, state.pattern)

		// Create new unformatted value
		const newUnformatted =
			currentUnformatted.slice(0, cursorPos) + pastedText + currentUnformatted.slice(selectionEnd)

		// Format and update
		const formatted = formatValue(newUnformatted, state.pattern)
		input.value = formatted
		state.value = newUnformatted // This will trigger the binding update

		// Calculate and set new cursor position
		const newCursor = calculateCursorPosition(
			input.value,
			formatted,
			cursorPos + pastedText.length,
			state.pattern
		)

		requestAnimationFrame(() => {
			input.setSelectionRange(newCursor, newCursor)
		})
	}

	return {
		handleInput,
		handlePaste,
		formatValue,
		unformatValue
	}
}

export { createPatternInput }
export type { PatternToken, PatternChar, InputState }
