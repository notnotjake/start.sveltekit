import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase64url } from '@oslojs/encoding'

export function generateToken(byteLength: number = 32): string {
	const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
	return encodeBase64url(bytes).replace(/=+$/, '')
}

export function hashToken(token: string): string {
	return encodeBase64url(sha256(new TextEncoder().encode(token.replace(/=+$/, ''))))
}
