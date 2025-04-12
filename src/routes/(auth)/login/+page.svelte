<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'
	import { createClass } from '$utils/create-class'
	import { wipeVertical } from '$ui/motion/transitions'

	import { Suspense, Progress } from '$ui/feedback'
	import Arrow from '$ui/icons/arrow-circle-fill.svelte'
	import Divider from '$ui/divider.svelte'
	import Chevron from '$ui/icons/chevron.svelte'
	import PasswordInput from '$ui/auth/password-input.svelte'
	import PasskeyAuto from '$ui/auth/passkey-auto.svelte'
	import PasskeyButton from '$ui/auth/passkey-button.svelte'
	import MagicLinkMessage from '$ui/auth/magic-link-message.svelte'

	import type { PageData } from './$types'
	import { onMount } from 'svelte'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { emailSchema, passwordLoginSchema } from './schema.ts'

	let { data } = $props()

	const {
		form: emailForm,
		errors: emailErrors,
		allErrors: emailAllErrors,
		constraints: emailConstraints,
		message: emailMessage,
		enhance: emailEnhance,
		validate: emailValidate,
		validateForm: emailValidateForm,
		delayed: emailDelayed,
		timeout: emailTimeout
	} = superForm(data.emailForm, {
		id: 'checkEmailForm',
		resetForm: false,
		validators: zodClient(emailSchema),
		validationMethod: 'auto',
		delayMs: 150,
		timeoutMs: 3000,
		multipleSubmits: 'prevent',
		onSubmit({ formData, cancel }) {
			console.log('test')
		}
	})

	let identifier = $state('')
	let editIdentity = $state(false)

	let buttonWidth = $state(0)

	// Set user's timezone on component mount
	onMount(async () => {
		$emailForm.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
	})

	function resetForm() {
		if ($emailMessage) {
			$emailMessage = null
		}
	}

	let doAttentionAnimation = $state(false)
	async function emailAttentionAnimate() {
		doAttentionAnimation = false
		setTimeout(() => {
			doAttentionAnimation = true
		}, 5)
	}
</script>

{#if data.passkeyAuto}
	<PasskeyAuto />
{/if}

{#if data.magicStatus}
	<p>{data.magicStatus}</p>
{/if}

<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
	<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
		{#if data.reauthTitle}{data.reauthTitle}{:else if $emailMessage?.existingUser}Welcome back to
			Luxo{:else}Welcome to Luxo{/if}
	</h2>
	{#if data.reauthMessage}
		<p
			class="animate-fade-in-scale text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500"
			transition:wipeVertical={{ duration: 400 }}
		>
			{data.reauthMessage}
		</p>
	{:else if !$emailMessage}
		<p
			class="animate-fade-in-scale text-[1.05rem] leading-5 font-[430] tracking-[-0.015em] text-neutral-500"
			transition:wipeVertical={{ duration: 400 }}
		>
			Log in or sign up to get started
		</p>
	{/if}
</div>

<form method="POST" action="?/startLogin" use:emailEnhance class="w-full">
	<div
		class={createClass(
			'group relative flex h-12 w-full items-center overflow-hidden rounded-[0.9rem] ring-1 ring-neutral-100 focus-within:ring-2 focus-within:ring-blue-500',
			$emailMessage ? 'bg-neutral-50' : 'bg-neutral-100'
		)}
	>
		{#if $emailMessage}
			<div
				class="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-start"
			>
				<Chevron size="30px" class="text-neutral-400 group-hover:text-neutral-700" />
			</div>
		{/if}

		<input
			type="email"
			name="email"
			autocomplete="webauthn"
			id="email"
			placeholder="Continue with email"
			aria-label="Enter your email"
			bind:value={$emailForm.email}
			{...$emailConstraints.email}
			onfocusin={resetForm}
			class:attention-animation={doAttentionAnimation}
			class={createClass(
				'h-full w-full flex-grow-1 translate-y-0 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-[450] placeholder:text-neutral-400',
				$emailMessage ? 'cursor-pointer bg-none pr-4 text-center text-neutral-500' : 'pr-1'
			)}
		/>

		<!-- Hidden input to capture user's timezone -->
		<input type="hidden" aria-hidden name="timezone" bind:value={$emailForm.timezone} />

		<button
			type="submit"
			disabled={$emailAllErrors.length > 0 || $emailForm.email.length < 5}
			class="group flex h-full shrink-0 flex-nowrap items-center justify-end px-1 transition-all duration-200"
			bind:offsetWidth={buttonWidth}
			style:margin-right={$emailMessage ? `-${buttonWidth}px` : '0px'}
			class:cursor-[w-resize]={$emailAllErrors.length > 0}
			class:cursor-pointer={!$emailAllErrors.length > 0}
		>
			{#if $emailErrors.email}
				<p
					class="animate-fade-in-scale-right pointer-events-none cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.83rem] font-medium text-rose-600"
				>
					{$emailErrors.email}
				</p>
			{:else if $emailDelayed && !$emailTimeout}
				<div class="flex h-full items-center px-3">
					<Suspense.Spinner size={18} thickness={7} />
				</div>
			{:else}
				<Arrow
					class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-blue-500 transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
				/>
			{/if}
		</button>
	</div>
	{#if $emailTimeout}
		<p class="animate-fade-in-scale pt-0.5 pl-4 text-[0.83rem] font-medium text-rose-600">
			Something went wrong, please try again
		</p>
	{/if}
</form>

{#if $emailMessage}
	<div transition:wipeVertical class="flex w-full flex-col gap-2 pt-5">
		{#if $emailMessage?.passkeyAvailable}
			<PasskeyButton />
		{/if}

		{#if $emailMessage?.passwordAvailable}
			<PasswordInput formData={data.passwordLoginForm} email={$emailForm.email} />
		{/if}

		{#if $emailMessage?.emailAvailable}
			<MagicLinkMessage
				email={$emailForm.email}
				triggerAttention={emailAttentionAnimate}
				emailSent={$emailMessage?.emailSentSuccess}
			/>
		{/if}
	</div>
{/if}

<style>
	.attention-animation {
		animation: bounce 0.7s ease-in-out;
	}

	@keyframes bounce {
		0% {
			transform: translateY(0);
			color: inherit;
		}
		15% {
			transform: translateY(-4px);
			color: var(--color-blue-500);
		}
		30% {
			transform: translateY(-4px);
			color: var(--color-blue-500);
		}
		45% {
			transform: translateY(0);
			color: var(--color-blue-500);
		}
		65% {
			transform: translateY(-2px);
			color: var(--color-blue-500);
		}
		80% {
			transform: translateY(-2px);
			color: var(--color-blue-500);
		}
		100% {
			transform: translateY(0);
			color: inherit;
		}
	}
</style>
