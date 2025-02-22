import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase64url } from '@oslojs/encoding'

export function generateToken(byteLength: number = 32): string {
	const bytes = crypto.getRandomValues(new Uint8Array(byteLength))
	return encodeBase64url(bytes).replace(/=+$/, '')
}

export function hashToken(token: string): string {
	return encodeBase64url(sha256(new TextEncoder().encode(token.replace(/=+$/, ''))))
}

export function setDelay(delayMs: number): number {
	return Date.now() + delayMs
}

export async function withDelay<T>(endTime: number, result: T): Promise<T> {
	const remainingTime = endTime - Date.now()

	if (remainingTime > 0) {
		await new Promise((resolve) => setTimeout(resolve, remainingTime))
	}

	return result
}
