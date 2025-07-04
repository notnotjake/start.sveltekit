import type { Attachment } from 'svelte/attachments'

/**
 * Attachment that selects all text in an input/textarea when clicked or tapped.
 * 
 * Features:
 * - Debounces rapid clicks (1500ms)
 * - Respects existing text selections
 * - Works on both desktop (mouse) and mobile (touch)
 * - On mobile, only triggers when cursor is at beginning or end
 */
export const inputSelectAll: Attachment = (element) => {
	let lastActivationTime = 0
	const DEBOUNCE_TIME = 1500
	const MOBILE_DELAY = 50

	/**
	 * Checks if the user has selected any text (selection start != end)
	 */
	const hasSelection = (target: HTMLInputElement | HTMLTextAreaElement): boolean => {
		return target.selectionStart !== target.selectionEnd
	}

	/**
	 * Checks if cursor is at the beginning (0) or end (length) of the text
	 * Used on mobile to prevent selecting all when user is positioning cursor
	 */
	const isCursorAtEdge = (target: HTMLInputElement | HTMLTextAreaElement): boolean => {
		const cursorPosition = target.selectionStart
		return cursorPosition === 0 || cursorPosition === target.value.length
	}

	/**
	 * Determines if we should select all text based on debounce time, 
	 * existing selections, and cursor position (mobile only)
	 */
	const shouldSelectAll = (target: HTMLInputElement | HTMLTextAreaElement, isMobile = false): boolean => {
		const currentTime = Date.now()
		const debounceOk = currentTime - lastActivationTime >= DEBOUNCE_TIME
		const noSelection = !hasSelection(target)
		
		// On mobile, also check if cursor is at the edges
		if (isMobile) {
			return debounceOk && noSelection && isCursorAtEdge(target)
		}
		
		return debounceOk && noSelection
	}

	/**
	 * Performs the actual text selection and updates the activation timestamp
	 */
	const selectAllText = (target: HTMLInputElement | HTMLTextAreaElement) => {
		target.setSelectionRange(0, target.value.length)
		lastActivationTime = Date.now()
	}

	/**
	 * Main event handler for both mouse and touch events
	 * @param delay - Milliseconds to wait before processing (for mobile)
	 * @param isMobile - Whether this is a touch event requiring mobile-specific logic
	 */
	const handleEvent = (e: Event, delay = 0, isMobile = false) => {
		const target = e.target as HTMLInputElement | HTMLTextAreaElement
		
		const processSelection = () => {
			if (shouldSelectAll(target, isMobile)) {
				selectAllText(target)
			}
		}

		// Mobile needs a delay to let browser establish selection state
		if (delay > 0) {
			setTimeout(processSelection, delay)
		} else {
			processSelection()
		}
	}

	element.addEventListener('mouseup', (e) => handleEvent(e))
	element.addEventListener('touchend', (e) => handleEvent(e, MOBILE_DELAY, true))

	return () => {
		// Remove when the attachment is removed
		element.removeEventListener('mouseup', handleEvent)
		element.removeEventListener('touchend', handleEvent)
	}
}
