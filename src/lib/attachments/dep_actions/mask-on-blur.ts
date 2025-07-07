type MaskOnBlurOptions = {
	maskAtLength?: number
	maskCharacter?: string
	stripCharacters?: string
	visibleAtStart?: number
	visibleAtEnd?: number
	truncateFromStart?: number
	truncateFromEnd?: number
	truncattedFill?: string
}

/**
 * A Svelte action to format an input field when it loses focus.
 *
 * @param {HTMLElement} element - The input element.
 * @param {MaskOnBlurOptions} params - The formatting pattern.
 */
export function maskOnBlur(element: HTMLInputElement, params: MaskOnBlurOptions) {
	let options = {
		maskAtLength: 1,
		maskCharacter: '&bull;',
		stripCharacters: '',
		visibleAtStart: 0,
		visibleAtEnd: 0,
		truncateFromStart: 0,
		truncateFromEnd: 0,
		truncatedFill: '',
		...params
	}

	// Create shadow elements to achieve the mask effect
	const wrapper = document.createElement('div')
	const mask = document.createElement('div')
	// Set styles of the hidden wrapper container
	wrapper.style.position = 'relative'
	wrapper.style.width = '100%'
	// Set styles for our mask overlay
	mask.style.position = 'absolute'
	mask.style.left = '0'
	mask.style.top = '0'
	mask.style.width = '100%'
	mask.style.height = '100%'
	mask.style.display = 'none'
	mask.style.pointerEvents = 'none'
	mask.style.padding = getComputedStyle(element).padding
	mask.style.font = getComputedStyle(element).font
	mask.style.lineHeight = getComputedStyle(element).lineHeight
	mask.style.textAlign = getComputedStyle(element).textAlign
	// Mount them to DOM
	element.parentNode?.insertBefore(wrapper, element)
	wrapper.appendChild(element)
	wrapper.appendChild(mask)

	/**
	 * Transforms an input value into a masked version based on provided options.
	 *
	 * @param {string} val - The input value to be masked
	 * @returns {string} The masked value
	 */
	function maskValue(val: string): string {
		let processedVal = val

		// Strip characters
		if (options.stripCharacters) {
			for (const char of options.stripCharacters) {
				processedVal = processedVal.split(char).join('')
			}
		}

		// Calculate how many characters we'll actually use after truncation
		const startIndex = Math.max(options.truncateFromStart, options.visibleAtStart)
		const endIndex = Math.max(options.truncateFromEnd, options.visibleAtEnd)

		// Get middle portion and replace with mask characters
		let middlePortion = processedVal.slice(startIndex, endIndex > 0 ? -endIndex : undefined)
		const maskedMiddle = middlePortion.replace(/./g, options.maskCharacter)

		// Preserve start/end based on visible option
		const visibleStart = processedVal.slice(0, options.visibleAtStart)
		processedVal = processedVal.slice(options.visibleAtStart)
		const visibleEnd = options.visibleAtEnd > 0 ? processedVal.slice(-options.visibleAtEnd) : ''

		const fill = options.truncatedFill
		let startTruncated = ''
		let endTruncated = ''
		if (val.length > options.visibleAtStart + options.visibleAtEnd) {
			startTruncated = options.truncateFromStart > options.visibleAtStart ? fill : ''
			endTruncated = options.truncateFromEnd > options.visibleAtEnd ? fill : ''
		}

		return `${visibleStart}${startTruncated}${maskedMiddle}${endTruncated}${visibleEnd}`
	}

	function handleBlur() {
		if (options.maskAtLength && element.value.length < options.maskAtLength) {
			return
		}

		const newValue = maskValue(element.value)
		mask.innerHTML = newValue
		element.style.color = 'transparent'
		mask.style.display = 'block'
	}
	function handleFocus() {
		element.style.color = ''
		mask.style.display = 'none'
	}

	element.addEventListener('blur', handleBlur)
	element.addEventListener('focus', handleFocus)

	return {
		// Allow the action to update if the pattern changes.
		update(newParams: MaskOnBlurOptions) {
			params = newParams
		},
		destroy() {
			element.removeEventListener('blur', handleBlur)
			element.removeEventListener('focus', handleFocus)
			element.style.color = ''
			wrapper.parentNode?.insertBefore(element, wrapper)
			wrapper.remove()
		}
	}
}
