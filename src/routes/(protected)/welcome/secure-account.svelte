<script lang="ts">
	import PasskeyIcon from '$ui/icons/passkey.svelte'

	import Button from '$ui/input/button.svelte'
</script>

<div class="my-5 flex w-full flex-col">
	<h3 class="leading-8 font-medium text-neutral-800">Secure your Account</h3>
	<p class="mb-6 text-[0.95rem]/5 text-neutral-500">
		Adding a Passkey or password helps keep your account secure and makes signing in more
		convenient. <a class="text-blue-500 underline" href="https://1password.com/product/passkeys"
			>Learn about Passkeys</a
		>
	</p>

	<div class="col flex flex w-full flex-wrap gap-3">
		<Button
			href="settings/add-passkey"
			style="primary"
			class="text-md flex h-12 w-full gap-2 bg-neutral-800 hover:shadow-none"
			rounded="lg"
		>
			<PasskeyIcon />Add Passkey
		</Button>

		<Button
			href="settings/add-password"
			style="primary"
			class="text-md flex h-12 w-full gap-2 bg-neutral-300 text-black hover:bg-neutral-300 hover:shadow-none"
			rounded="lg"
		>
			Add Password
		</Button>
	</div>

	<div class="flex w-full justify-center">
		<Button
			href="/dashboard"
			resetStyles
			class="w-fit py-4 text-neutral-600 hover:bg-transparent hover:text-neutral-900">Skip</Button
		>
	</div>
</div>
