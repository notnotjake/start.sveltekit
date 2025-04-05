<script lang="ts">
	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import Arrow from '$ui/icons/arrow-circle-fill.svelte'
	import Checkmark from '$ui/icons/checkmark.svelte'
	import Toggle from './toggle.svelte'
	import { ToastInline } from '$ui/feedback'
	import Button from '$ui/input/button.svelte'

	let { data } = $props()

	const { form, errors, allErrors, constraints, message, enhance, validate, validateForm } =
		superForm(data.form, {
			resetForm: false,
			validationMethod: 'auto',
			onSubmit({ formData }) {
				formData.set('emailEnabled', $form.emailEnabled)
			}
		})

	let buttonWidth = $state(0)

	let allowEmail = $state(true)
	let triggerToast

	$inspect($form.emailEnabled)
</script>

<div class="mb-2 flex items-center justify-between py-5">
	<h2 class="tracking-tight-md text-[1.3rem] leading-loose font-[550]">Settings</h2>
</div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit items-center gap-4">
		<div
			class="aspect-square h-8 rounded-full bg-gray-200 ring-2 ring-neutral-400 ring-offset-2"
		></div>
		<div class="text-[0.9rem]">
			<p class="leading-none font-medium text-neutral-800">Jake Go</p>
			<p class="text-neutral-600">jake@notnotjake.com</p>
		</div>
	</div>

	<button
		class="text-vibrant-blue rounded-full border-1 border-transparent bg-transparent px-3.5 py-1.5 text-[0.95rem] font-medium hover:border-blue-50 hover:bg-blue-50"
		>Edit</button
	>
</div>

<Button suspense={true}><p>Test</p></Button>

<div
	class="ring-neutral-150 w-breakout-40 my-3 w-full rounded-2xl bg-neutral-50 px-3 py-3 ring-1 shadow-xs"
>
	<div class="flex items-center justify-between text-[0.95rem] hover:bg-neutral-50">
		<div class="flex w-fit gap-2 text-[0.95rem]">
			<p class="font-medium">Notifications</p>
			<p class="text-neutral-700"></p>
		</div>
		<button
			class="border-neutral-150 bg-neutral-150 box-content rounded-full border-1 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-200 hover:bg-neutral-200"
			>Manage</button
		>
	</div>
</div>

<div
	class="group focus-within:shadow-input-pop relative flex hidden h-11 h-[2.8rem] w-full flex-shrink-0 items-center overflow-hidden rounded-[0.9rem] bg-neutral-100 ring-1 ring-neutral-200"
>
	<input
		type="email"
		name="email"
		autocomplete="email"
		id="email"
		value="jake@notnotjake.com"
		placeholder="Continue with email"
		aria-label="Enter your email"
		class="h-full w-full flex-grow-1 translate-y-0 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500"
	/>
</div>

<div
	class="flex hidden h-full w-full flex-col items-center gap-3 rounded-[calc(1.3rem-0.5rem)] pt-7 pb-3"
>
	<a
		class="bg-vibrant-blue flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none px-3 text-[1.1rem] font-medium text-blue-50"
		href="/">Click to Login</a
	>
	<p
		class="flex h-[2.8rem] w-full items-center justify-center rounded-[0.9rem] border-none bg-neutral-200 px-3 font-mono text-[0.9rem] text-zinc-600"
	>
		951-028
	</p>

	<div class="h-12"></div>

	<div class="relative flex h-6 w-full flex-col items-center"></div>
</div>

<div class="w-breakout-full bg-neutral-150 my-3 h-[3px]"></div>

<h2 class="mt-1 text-lg font-semibold">Security</h2>

<div class="flex items-center justify-between py-1">
	<div class="flex w-fit items-center gap-2 text-[0.95rem]">
		<p class="font-medium">Login with Email</p>
		<p class="text-neutral-700">{allowEmail ? 'Enabled' : 'Disabled'}</p>

		<ToastInline
			bind:trigger={triggerToast}
			class="flex items-center gap-[0.2rem] rounded-full bg-green-100 p-[2px]"
		>
			<Checkmark size="20px" class="text-green-400" />
			<p class="pr-2 text-[0.9rem]/1 font-medium text-green-500">Saved</p>
		</ToastInline>
	</div>
	<form method="POST" action="?/changeEmailEnabled" use:enhance>
		<Toggle
			bind:checked={$form.emailEnabled}
			name="email-enabled"
			submits
			onChange={() => {
				console.log('A', $form.emailEnabled)
				triggerToast()
			}}
		/>
	</form>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Passkey</p>
		<p class="text-neutral-700">None Setup</p>
	</div>
	<button
		class="shadow-primary rounded-full border-1 border-neutral-200 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100"
		>Add Passkey</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<div class="flex w-fit gap-2 text-[0.95rem]">
		<p class="font-medium">Password</p>
		<p class="text-neutral-700">Set 2 Weeks Ago</p>
	</div>
	<button
		class="shadow-primary rounded-full border-1 border-neutral-200 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-300 hover:bg-neutral-100"
		>Change Password</button
	>
</div>

<div class="shadow-primary my-3 w-full rounded-2xl border border-gray-200 px-3 py-2">
	<div class="flex items-center justify-between py-2 text-[0.95rem]">
		<div class="flex w-fit gap-2 text-[0.95rem]">
			<p class="font-medium">Sessions</p>
			<p class="text-neutral-700">2 Active</p>
		</div>
		<button
			class="border-neutral-150 bg-neutral-150 box-content rounded-full border-1 px-3.5 py-1.5 text-[0.95rem] font-medium text-neutral-800 hover:border-neutral-200 hover:bg-neutral-200"
			>Manage</button
		>
	</div>
</div>

<div class="w-breakout-full bg-neutral-150 my-3 h-[3px]"></div>

<h2 class="mt-1 text-lg font-semibold">Account</h2>

<div class="flex items-center justify-between py-2">
	<p class="">Log out on this device</p>
	<button
		class="rounded-full bg-neutral-700 px-3.5 py-1.5 text-[0.95rem] font-medium text-white hover:bg-neutral-800"
		>Log Out</button
	>
</div>

<div class="bg-neutral-150 my-1.5 h-[1px] rounded-full"></div>

<div class="flex items-center justify-between py-2">
	<p class="">Delete Account</p>
	<button
		class="rounded-full bg-red-500 px-3.5 py-1.5 text-[0.95rem] font-medium text-rose-50 hover:bg-red-600"
		>Delete Account</button
	>
</div>

<style>
	.shadow-primary {
		box-shadow:
			rgba(0, 0, 0, 0.07) 0px 0.602187px 0.602187px -1.166667px,
			rgba(0, 0, 0, 0.063) 0px 2.288533px 2.288533px -2.333333px,
			rgba(0, 0, 0, 0.03) 0px 10px 10px -3.5px;
	}
</style>
