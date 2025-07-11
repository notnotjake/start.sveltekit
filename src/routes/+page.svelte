<script lang="ts">
	import { assetUrl } from '$utils/asset-url'
	import Button from '$ui/input/button.svelte'
</script>

<div class="mx-auto flex min-h-full max-w-160 flex-col gap-2 bg-neutral-50 px-6 py-8">
	<h1 class="text-lg font-medium">SvelteKit Auth Example</h1>
	<p class="tracking-[-0.01em]">
		Project setup using SvelteKit, Typescript, Tailwind 4, Prettier, Drizzle ORM with Turso SQLite,
		Zod, Superforms, and SvelteKit-Meta. The project also includes some of an upcoming components
		library and useful utilities
	</p>

	<div
		class="flex flex-col gap-2 py-3 text-[0.92rem]/5 font-medium tracking-[-0.01em] text-neutral-600"
	>
		<p>
			When testing auth, you can sign up with email and after creating an account can continue just
			using your email for a passwordless experience, or you can add a passkey. You can also create
			a password but we will be discouraging passwords in favor of email or passkey passwordless
			auth.
		</p>
	</div>

	<Button href="/login" style="primary" rounded="md" class="w-fit">Login</Button>

	<div
		class="mt-70 flex flex-col gap-2 py-3 text-[0.92rem]/5 font-medium tracking-[-0.01em] text-neutral-600"
	>
		<p>
			Todo: potentially support OAuth, add 2FA TOTP, add recovery codes system and allow users to
			turn off email login when setup, complete settings routes (rename passkeys, remove password,
			etc), route to /welcome when new user sign up.
		</p>
	</div>
</div>
