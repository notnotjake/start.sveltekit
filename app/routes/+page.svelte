<script lang="ts">
	import { assetUrl } from '$utils/asset-url'
</script>

<div class="flex flex-col items-center justify-center gap-2 py-4">
	<h1
		class="rounded-lg px-4 py-1 font-medium tracking-tight transition-all duration-300 selection:bg-indigo-700 selection:text-emerald-200 hover:bg-slate-200 hover:text-emerald-500"
	>
		Start with SvelteKit
	</h1>

	<p class="text-emerald-600">
		This project is setup with Svelte 5, TypeScript, Prettier, ESLint, Tailwind CSS, Vitetest,
		Playwright Testing, and More
	</p>

	<a href="/test">Test Stuff</a>

	<img src={assetUrl('images/blue-summer-gradient.jpg')} alt="very blue sky with some clouds" />
</div>
