import { describe, it, expect } from 'bun:test'
import { detectBrowser, getBrowserNameForPasskey } from './browser-detection'

describe('Browser Detection', () => {
	it('should detect Chrome correctly', () => {
		// Mock Chrome user agent
		Object.defineProperty(navigator, 'userAgent', {
			value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
			configurable: true
		})
		
		expect(detectBrowser()).toBe('Chrome')
		expect(getBrowserNameForPasskey()).toBe('Chrome')
	})

	it('should detect Safari correctly', () => {
		// Mock Safari user agent
		Object.defineProperty(navigator, 'userAgent', {
			value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
			configurable: true
		})
		
		expect(detectBrowser()).toBe('Safari')
		expect(getBrowserNameForPasskey()).toBe('Safari')
	})

	it('should detect Firefox correctly', () => {
		// Mock Firefox user agent
		Object.defineProperty(navigator, 'userAgent', {
			value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0',
			configurable: true
		})
		
		expect(detectBrowser()).toBe('Firefox')
		expect(getBrowserNameForPasskey()).toBe('Firefox')
	})

	it('should detect Edge correctly', () => {
		// Mock Edge user agent
		Object.defineProperty(navigator, 'userAgent', {
			value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
			configurable: true
		})
		
		expect(detectBrowser()).toBe('Edge')
		expect(getBrowserNameForPasskey()).toBe('Edge')
	})

	it('should return Unknown for unrecognized browsers', () => {
		// Mock unknown browser user agent
		Object.defineProperty(navigator, 'userAgent', {
			value: 'SomeUnknownBrowser/1.0',
			configurable: true
		})
		
		expect(detectBrowser()).toBe('Unknown')
		expect(getBrowserNameForPasskey()).toBe('Unknown')
	})
}) 