import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
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
			$utils: 'app/lib/utils'
		}
	},
	preprocess: vitePreprocess()
}

export default config
