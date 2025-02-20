import { generateToken, hashToken } from './utils'

export async function createMagicLink(email: string) {
	const token = generateToken()
	const hashedToken = hashToken(token)
	const magicLink = {
		id: hashedToken,
		email,
		expiresAt: new Date(Date.now() + 30 * 60 * 1000), // expires in 30 minutes
		createdAt: new Date()
	}
	await db.insert(table.magicLink).values(magicLink)
	return token
}

export async function validateMagicLink(token: string) {
	const hashedToken = hashToken(token)
	const [link] = await db.select().from(table.magicLink).where(eq(table.magicLink.id, tokenHash))

	if (!link || link.usedAt || Date.now() > link.expiresAt.getTime()) {
		return null
	}

	await db
		.update(table.magicLink)
		.set({ usedAt: new Date() })
		.where(eq(table.magicLink.id, tokenHash))
}

export async function sendMagicLinkEmail(email: string, token: string) {}
