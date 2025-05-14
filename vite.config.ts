import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		include: ['app/**/*.{test,spec}.{js,ts}']
	},
	server: {
		allowedHosts: [
			'localhost',
			'127.0.0.1',
			'web.sveltekit-dev.orb.local',
			'.orb.local',
			'weekly-clear-akita.ngrok-free.app'
		]
	}
})
