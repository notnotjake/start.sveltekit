import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: [
		sveltePreprocess({
			scss: {
				prependData: `
				@use 'src/lib/_global/_variables' as v;
				@use 'src/lib/_global/_mixins' as m;
				`
			}
		})
	]
};

export default config;
