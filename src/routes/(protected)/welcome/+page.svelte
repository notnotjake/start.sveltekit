<script lang="ts">
	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'

	import Button from '$ui/input/button.svelte'
	import TextInput from '$ui/input/text-input.svelte'
</script>

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Welcome!
		</h2>
		<div class="animate-fade-in-scale flex items-center justify-center gap-1">
			<CheckmarkIcon class="text-green-500" size="19px" />
			<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
				Your account has been created
			</p>
		</div>
	</div>

	<div class="my-4 flex w-full flex-col">
		<label for="name" class="mb-1 px-2 text-[0.95rem] font-medium tracking-tight text-neutral-500"
			>What can we call you?</label
		>
		<TextInput id="name" placeholder="Johnny Appleseed" />
	</div>

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
				variant="primary"
				class="text-md flex h-12 w-full gap-2 bg-neutral-800 hover:shadow-none"
				rounded="lg"
			>
				<PasskeyIcon />Add Passkey
			</Button>

			<Button
				href="settings/add-password"
				variant="primary"
				class="text-md flex h-12 w-full gap-2 bg-neutral-300 text-black hover:bg-neutral-300 hover:shadow-none"
				rounded="lg"
			>
				Add Password
			</Button>
		</div>

		<div class="flex w-full justify-center">
			<Button
				href="/dashboard"
				variant="ghost"
				class="w-fit py-4 text-neutral-600 hover:bg-transparent hover:text-neutral-900">Skip</Button
			>
		</div>
	</div>
</div>
