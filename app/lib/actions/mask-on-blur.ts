/**
 * A Svelte action to format an input field when it loses focus.
 *
 * @param {HTMLElement} element - The input element.
 * @param {string} pattern - The formatting pattern.
 */
export function maskOnBlur(element: HTMLInputElement) {
	const wrapper = document.createElement('div')
	const mask = document.createElement('div')

	wrapper.style.position = 'relative'

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

	element.parentNode?.insertBefore(wrapper, element) // adds our wrapper just before element
	wrapper.appendChild(element)
	wrapper.appendChild(mask)

	function handleBlur() {
		element.style.color = 'transparent'
		mask.textContent = 'TST'
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
		update(newPattern: string) {
			pattern = newPattern
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
