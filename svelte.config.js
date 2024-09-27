import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		files: {
			routes: 'app/routes',
			lib: 'app/lib',
			assets: 'app/assets',
			appTemplate: 'app/app.html',
			hooks: {
				server: 'app/hooks/hooks.server',
				client: 'app/hooks/hooks.client'
			}
		},
		alias: {
			$lib: 'app/lib',
			$components: 'app/components'
		}
	},
	preprocess: vitePreprocess()
}

export default config
