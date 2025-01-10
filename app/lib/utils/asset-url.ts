import { PUBLIC_URL_ASSETS } from '$env/static/public'

export function assetUrl(path: string) {
	return `${PUBLIC_URL_ASSETS}/${path}`
}
