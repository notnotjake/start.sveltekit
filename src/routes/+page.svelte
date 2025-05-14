<script lang="ts">
	import { assetUrl } from '$utils/asset-url'
	import Button from '$ui/input/button.svelte'
</script>

<div class="mx-auto flex min-h-full max-w-160 flex-col gap-2 bg-neutral-50 px-6 py-8">
	<h1 class="text-lg font-medium">SvelteKit Starter</h1>
	<p>A headstart for SvelteKit projects</p>
	<p>
		Setup with Typescript, Tailwind 4, Prettier, Drizzle + SQLite (easily swapped for Turso), Zod,
		SuperForms, and my package SvelteKit-Meta.
	</p>
	<p>
		The project also includes code for managing self-hosted fonts, a createClass function, env
		validation, plus a script for resetting the database in development. And I am working on an
		amazing auth experience and a component library.
	</p>

	<Button href="/login" style="primary" rounded="md" class="w-fit">Login</Button>

	<Button
		href="/playground"
		style="secondary"
		rounded="full"
		class="w-fit text-blue-500 hover:text-blue-600">Go to Playground</Button
	>
</div>
