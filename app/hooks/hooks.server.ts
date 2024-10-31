// import type { Handle } from '@sveltejs/kit'
// import fs from 'fs/promises'
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
// import { sequence } from '@sveltejs/kit/hooks'
//
// // Type for meta data
// interface MetaData {
// 	title?: string
// 	description?: string
// 	// Add other meta properties as needed
// 	[key: string]: string | undefined
// }
//
// async function loadMetaData(route: string): Promise<MetaData | null> {
// 	try {
// 		// Convert route to filesystem path
// 		// Remove dynamic parameters from route
// 		const cleanRoute = route
// 			.split('/')
// 			.map((segment) => {
// 				return segment.startsWith('[') ? segment.replace(/[\[\]]/g, '') : segment
// 			})
// 			.join('/')
//
// 		// Get the root directory of your project
// 		const __filename = fileURLToPath(import.meta.url)
// 		const __dirname = dirname(__filename)
// 		const routesDir = join(__dirname, '..', 'routes')
//
// 		// Try to load meta.ts first, fall back to meta.json
// 		try {
// 			const metaModule = await import(join(routesDir, cleanRoute, 'meta.ts'))
// 			return metaModule.default
// 		} catch {
// 			const jsonPath = join(routesDir, cleanRoute, 'meta.json')
// 			const jsonContent = await fs.readFile(jsonPath, 'utf-8')
// 			return JSON.parse(jsonContent)
// 		}
// 	} catch (error) {
// 		// Return null if no meta file exists
// 		return null
// 	}
// }
//
// export const handleMeta: Handle = async ({ event, resolve }) => {
// 	const meta = await loadMetaData(event.url.pathname)
//
// 	if (meta) {
// 		event.locals.meta = meta
// 	}
//
// 	return resolve(event)
// }
//
// // Combine with other handlers if needed
// export const handle = sequence(handleMeta)
