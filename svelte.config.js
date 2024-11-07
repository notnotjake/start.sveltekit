import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		paths: {
			base: process.env.PUBLIC_URL_BASE || '',
			assets: process.env.PUBLIC_URL_ASSETS || ''
		},
		files: {
			appTemplate: 'app/app.html',
			errorTemplate: 'app/error.html',
			lib: 'app/lib',
			assets: 'static',
			routes: 'app/routes',
			params: 'app/params',
			hooks: {
				server: 'app/hooks/hooks.server',
				client: 'app/hooks/hooks.client',
				universal: 'app/hooks/hooks'
			},
			serviceWorker: 'app/service-worker'
		},
		alias: {
			$lib: 'app/lib',
			$ui: 'app/lib/components',
			$utils: 'app/lib/utils',
			$tailwind: 'app/lib/theme/app.css'
		}
	},
	preprocess: vitePreprocess()
}

export default config
