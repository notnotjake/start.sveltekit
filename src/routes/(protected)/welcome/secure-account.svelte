<script lang="ts">
	import PasskeyIcon from '$ui/icon/passkey.svelte'

	import Button from '$ui/input/button.svelte'

	import { IconArrowForwardUp } from '@tabler/icons-svelte'
</script>

<div class="my-5 flex w-full flex-col text-left">
	<h3 class="text-left text-[1.1rem] leading-8 font-medium text-neutral-800">
		Secure your Account
	</h3>
	<p class="mb-6 text-[0.95rem]/5 text-neutral-500">
		Adding a Passkey helps keep your account secure and makes signing in more convenient. <a
			class="text-blue-500 underline"
			href="https://1password.com/product/passkeys">Learn about Passkeys</a
		>
	</p>

	<div class="col flex w-full flex-wrap gap-3">
		<Button
			href="settings/add-passkey"
			style="primary"
			class="text-md bg-vibrant-blue hover:bg-vibrant-blue flex h-12 w-full gap-2 hover:scale-x-[103%]"
			rounded="lg"
		>
			<PasskeyIcon />Add Passkey
		</Button>

		<Button
			href="settings/add-password"
			style="primary"
			class="text-md flex h-12 w-full gap-2 bg-neutral-100 text-black/60 hover:bg-neutral-300 hover:shadow-none"
			rounded="lg"
		>
			Or add password
		</Button>
	</div>
</div>
