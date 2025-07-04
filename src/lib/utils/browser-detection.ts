/**
 * Detects the browser name from the user agent string
 * @returns The browser name (e.g., 'Chrome', 'Safari', 'Firefox', 'Edge', 'Opera', 'Unknown')
 */
export function detectBrowser(): string {
	if (typeof window === 'undefined') {
		return 'Unknown'
	}

	const userAgent = navigator.userAgent

	// Chrome (including Chromium-based browsers like Edge)
	if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
		return 'Chrome'
	}

	// Safari
	if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
		return 'Safari'
	}

	// Firefox
	if (userAgent.includes('Firefox')) {
		return 'Firefox'
	}

	// Edge
	if (userAgent.includes('Edg')) {
		return 'Edge'
	}

	// Opera
	if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
		return 'Opera'
	}

	// Brave (often reports as Chrome but can be detected)
	if (userAgent.includes('Brave')) {
		return 'Brave'
	}

	return 'Unknown'
}

/**
 * Gets a user-friendly browser name for passkey naming
 * @returns A formatted browser name suitable for passkey naming
 */
export function getBrowserNameForPasskey(): string {
	const browser = detectBrowser()
	
	// Return the browser name as-is for most cases
	// This will be used as the default name for new passkeys
	return browser
} 