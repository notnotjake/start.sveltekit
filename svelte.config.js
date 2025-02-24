import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base: process.env.PUBLIC_URL_BASE || ''
		},
		files: {
			appTemplate: 'src/app.html',
			errorTemplate: 'src/error.html',
			lib: 'src/lib',
			assets: 'static',
			routes: 'src/routes',
			params: 'src/params',
			hooks: {
				server: 'src/hooks/hooks.server',
				client: 'src/hooks/hooks.client',
				universal: 'src/hooks/hooks'
			},
			serviceWorker: 'src/service-worker'
		},
		alias: {
			$ui: 'src/lib/components',
			$utils: 'src/lib/utils',
			$tailwind: 'src/lib/theme/app.css'
		}
	},
	preprocess: vitePreprocess()
}

export default config
