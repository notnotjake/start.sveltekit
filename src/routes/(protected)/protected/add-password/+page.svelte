<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { passwordSchema } from './schema.ts'

	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import CheckmarkIcon from '$ui/icons/checkmark.svelte'
	import { wipeVertical } from '$ui/motion/transitions'

	let submitSuccess: boolean | null = $state(null)

	let { data } = $props()

	const {
		form,
		errors,
		allErrors,
		constraints,
		message,
		enhance,
		validate,
		validateForm,
		delayed,
		timeout
	} = superForm(data.addPasswordForm, {
		resetForm: false,
		validators: zodClient(passwordSchema),
		delayMs: 300,
		timeoutMs: 1000,
		multipleSubmits: 'prevent'
	})
</script>

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Add a Password
		</h2>

		{#if submitSuccess === true}
			<div transition:wipeVertical class="flex items-center justify-center gap-1">
				<CheckmarkIcon class="text-green-500" size="19px" />
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500">
					New password successfully added
				</p>
			</div>
		{:else if submitSuccess === false}
			<div trantision:wipeVertical class="flex items-center justify-center gap-1">
				<p class=" text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-rose-500">
					Something went wrong, please try again
				</p>
			</div>
		{/if}
	</div>

	<form method="POST" action="?/addPassword" use:enhance autocomplete="new-password">
		<div class="my-4 flex w-80 flex-col">
			<input
				type="hidden"
				id="username"
				name="username"
				autocomplete="username"
				value={data.email}
				disabled
				class="hidden"
			/>

			<label
				for="password"
				class="mb-1 px-2 text-[0.95rem] font-medium tracking-tight text-neutral-500"
				>New Password</label
			>
			<input
				type="password"
				name="password"
				id="password"
				autocomplete="new-password"
				bind:value={$form.password}
				{...$constraints.password}
				placeholder="Create new password"
				class="h-12 w-full rounded-[0.9rem] bg-neutral-100 px-4 ring-1 ring-neutral-100 outline-none focus:ring-2 focus:ring-blue-500"
			/>
		</div>

		<button
			type="submit"
			class="h-12 w-full rounded-[0.9rem] bg-blue-500 px-4 ring-1 ring-neutral-100 outline-none focus:ring-2 focus:ring-blue-500"
		>
			Submit
		</button>
	</form>
</div>
