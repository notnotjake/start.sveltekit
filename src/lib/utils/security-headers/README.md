# Setting Security Headers in Handle Hooks

This module provides a simple way to apply security headers in a SvelteKit application. It is inspired by [Helmet.js](https://helmetjs.github.io/) and best practices from [OWASP's HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html). 

You can apply security headers globally or customize them for specific routes using SvelteKit’s server hooks.

It **includes a default configuration** that covers key security concerns and **allows for overrides** per route.

#### **⚠️ Running In Development**

When running in development mode (NODE_ENV="development"), some security headers are adjusted to prevent unintended blocking during local development:

- `strictTransportSecurity` will not be set
- `upgrade-insecure-requests` will not be set

#### **🚀 Quick Reference:**

```
import { applySecurityHeaders } from '$utils/security-headers'

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event)
	applySecurityHeaders(response)
	return response
}
```

**Overriding Defaults**

```
	applySecurityHeaders(response, {
		contentSecurityPolicy: {
			'script-src': ["'self'", "'strict-dynamic'"],
			'frame-ancestors': ["'none'"]
		},
		'xXssProtection': false
		referrerPolicy: 'no-referrer'
	})
```

**Apply to Specific Routes**

```
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (event.url.pathname.startsWith('/admin')) {
		applySecurityHeaders(response);
	}

	return response;
};
```

## Supported Headers Reference

The following headers are supported. Defaults are provided where applicable:

| Header Name | Key in Config | Default |
|-------------|------------------------|---------|
| Content-Security-Policy | `contentSecurityPolicy` | See full default CSP below |
| Cross-Origin-Embedder-Policy | `crossOriginEmbedderPolicy` | `require-corp` |
| Cross-Origin-Opener-Policy | `crossOriginOpenerPolicy` | `same-origin` |
| Cross-Origin-Resource-Policy | `crossOriginResourcePolicy` | `same-origin` |
| X-DNS-Prefetch-Control | `dnsPrefetchControl` | Not set |
| Referrer-Policy | `referrerPolicy` | Not set |
| Strict-Transport-Security | `strictTransportSecurity` | `max-age=15552000; includeSubDomains` (disabled in dev) |
| X-Content-Type-Options | `xContentTypeOptions` | `nosniff` |
| X-Frame-Options | `xFrameOptions` | `SAMEORIGIN` |
| X-XSS-Protection | `xXssProtection` | `1; mode=block` |
| X-Permitted-Cross-Domain-Policies | `xPermittedCrossDomainPolicies` | Not set |

### Default Content Security Policy
By default, `contentSecurityPolicy` is set to:

```
{
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
	'upgrade-insecure-requests': ['1'] // This is disabled in development mode
}
```
