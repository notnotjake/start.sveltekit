import { NODE_ENV } from '$env/static/private'
const isDev = NODE_ENV === 'development'

// Define types for CSP configuration
type CspDirectiveValue = string[]
type CspConfig = Record<string, CspDirectiveValue>

interface SecurityConfigBase {
	crossOriginEmbedderPolicy?: string | false
	crossOriginOpenerPolicy?: string | false
	crossOriginResourcePolicy?: string | false
	dnsPrefetchControl?: string | false
	referrerPolicy?: string | false
	strictTransportSecurity?: string | false
	xContentTypeOptions?: string | false
	xFrameOptions?: string | false
	xXssProtection?: string | false
	xPermittedCrossDomainPolicies?: string | false
}

type DefaultSecurityConfig = {
	contentSecurityPolicy: CspConfig
} & SecurityConfigBase

type OverrideSecurityConfig = {
	contentSecurityPolicy?: CspConfig
} & SecurityConfigBase

// Map config keys to actual header names
const HEADER_NAMES: Record<keyof DefaultSecurityConfig, string> = {
	contentSecurityPolicy: 'Content-Security-Policy',
	crossOriginEmbedderPolicy: 'Cross-Origin-Embedder-Policy',
	crossOriginOpenerPolicy: 'Cross-Origin-Opener-Policy',
	crossOriginResourcePolicy: 'Cross-Origin-Resource-Policy',
	dnsPrefetchControl: 'X-DNS-Prefetch-Control',
	referrerPolicy: 'Referrer-Policy',
	strictTransportSecurity: 'Strict-Transport-Security',
	xContentTypeOptions: 'X-Content-Type-Options',
	xFrameOptions: 'X-Frame-Options',
	xXssProtection: 'X-XSS-Protection',
	xPermittedCrossDomainPolicies: 'X-Permitted-Cross-Domain-Policies'
}

export const defaultSecurityConfig: DefaultSecurityConfig = {
	contentSecurityPolicy: {
		'default-src': ["'self'"],
		'base-uri': ["'self'"],
		'font-src': ["'self'", 'https:', 'data:'],
		'form-action': ["'self'"],
		'frame-ancestors': ["'self'"],
		'img-src': ["'self'", 'data:', 'https:', 'blob:'],
		'object-src': ["'none'"],
		'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
		'script-src-attr': ["'none'"],
		'style-src': ["'self'", "'unsafe-inline'", 'https:'],
		'connect-src': ["'self'", 'https:'],
		'media-src': ["'self'", 'https:'],
		'upgrade-insecure-requests': isDev ? ['0'] : ['1']
	},
	crossOriginEmbedderPolicy: 'require-corp',
	crossOriginOpenerPolicy: 'same-origin',
	crossOriginResourcePolicy: 'same-origin',
	strictTransportSecurity: isDev ? false : 'max-age=15552000; includeSubDomains',
	xContentTypeOptions: 'nosniff',
	xFrameOptions: 'SAMEORIGIN',
	xXssProtection: '1; mode=block'
}

function generateCspString(cspConfig: CspConfig): string {
	return Object.entries(cspConfig)
		.map(([key, values]) => {
			if (values.length === 0) return key
			return `${key} ${values.join(' ')}`
		})
		.join('; ')
}

export function applySecurityHeaders(
	response: Response,
	overrideConfig: OverrideSecurityConfig = {}
): Response {
	// Merge CSP config specially to handle nested object
	const mergedCspConfig = overrideConfig.contentSecurityPolicy
		? { ...defaultSecurityConfig.contentSecurityPolicy, ...overrideConfig.contentSecurityPolicy }
		: defaultSecurityConfig.contentSecurityPolicy

	// Set CSP header
	response.headers.set(HEADER_NAMES.contentSecurityPolicy, generateCspString(mergedCspConfig))

	// Handle all other headers
	const { contentSecurityPolicy: _, ...mergedConfig } = {
		...defaultSecurityConfig,
		...overrideConfig
	}
	Object.entries(mergedConfig).forEach(([key, value]) => {
		if (value) {
			response.headers.set(HEADER_NAMES[key as keyof DefaultSecurityConfig], value)
		}
	})

	return response
}
