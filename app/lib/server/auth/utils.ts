import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding'

export function generateToken(byteLength: number = 32): string {
	const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
	return encodeBase64url(bytes)
}

export function hashToken(token: string): string {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
}
