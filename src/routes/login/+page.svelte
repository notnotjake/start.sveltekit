<script lang="ts">
	import { fade } from 'svelte/transition'
	import { createClass } from '$utils/create-class'
	import { Suspense, Progress } from '$ui/feedback'
	import PasswordInput from '$ui/auth/password-input.svelte'
	import PasskeyButton from '$ui/auth/passkey-button.svelte'
	import OAuth from '$ui/auth/oauth.svelte'
	import MagicLinkMessage from '$ui/auth/magic-link-message.svelte'
	import Arrow from '$lib/theme/icons/arrow-circle-fill.svelte'
	import Divider from '$ui/divider.svelte'

	import type { PageData } from './$types'
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { emailSchema, passwordLoginSchema } from './schema.ts'
	import { onMount } from 'svelte'

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
		multipleSubmits: 'prevent'
	})

	let identifier = $state('')
	let editIdentity = $state(false)

	let buttonWidth = $state(0)

	// Set user's timezone on component mount
	onMount(() => {
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

<form method="POST" action="?/checkEmail" use:emailEnhance class="w-full">
	<div
		class={createClass(
			'group focus-within:shadow-input-pop relative flex h-11 h-[2.8rem] w-full items-center overflow-hidden rounded-[0.9rem] ring-1 ring-neutral-200',
			$emailMessage ? 'bg-none' : 'bg-neutral-100 ring-1 ring-neutral-200'
		)}
	>
		<input
			type="email"
			name="email"
			autocomplete="email"
			id="email"
			placeholder="Continue with email"
			aria-label="Enter your email"
			bind:value={$emailForm.email}
			{...$emailConstraints.email}
			onfocusin={resetForm}
			class:attention-animation={doAttentionAnimation}
			class={createClass(
				'h-full w-full flex-grow-1 pl-4 font-[450] text-zinc-900 transition-all outline-none selection:bg-sky-200 selection:text-blue-600 placeholder:font-normal placeholder:text-neutral-500',
				$emailErrors.email && 'text-rose-500',
				$emailMessage ? 'cursor-pointer bg-none pr-4 text-center' : 'pr-1'
			)}
		/>

		<!-- Hidden input to capture user's timezone -->
		<input type="hidden" name="timezone" bind:value={$emailForm.timezone} />

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
					class="animate-fade-in-scale-right cursor-[w-resize] rounded-full bg-rose-100 px-3 py-1 text-[0.83rem] font-medium text-rose-600"
				>
					{$emailErrors.email}
				</p>
			{:else if $emailDelayed && !$emailTimeout}
				<div class="flex h-full items-center px-3">
					<Suspense.Spinner size={18} thickness={7} />
				</div>
			{:else}
				<Arrow
					class="bi bi-arrow-right-circle-fill mr-1 h-6 w-6 cursor-pointer p-[0.1rem] text-[#0E8CFF] transition-colors duration-300 ease-in-out group-disabled:text-neutral-500/80"
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

<div class="min-h-24">
	{#if $emailMessage?.emailSentSuccess}
		<MagicLinkMessage
			formData={data.emailResendForm}
			schema={emailSchema}
			email={$emailForm.email}
			triggerAttention={emailAttentionAnimate}
		/>
	{/if}
</div>

{#if !$emailMessage || $emailMessage.passwordAvailable || $emailMessage.passkeyAvailable}
	<Divider text={'Or Continue With'} isCollapsed={$emailMessage} />
{/if}

{#if $emailMessage}
	<div class="flex w-full flex-col flex-nowrap gap-2">
		{#if $emailMessage?.passwordAvailable}
			<PasswordInput formData={data.passwordLoginForm} email={$emailForm.email} />
		{/if}
		{#if $emailMessage?.passkeyAvailable}
			<PasskeyButton />
		{/if}
	</div>
{:else}
	<OAuth />
{/if}

<style>
	.attention-animation {
		animation: bounce 0.7s ease-in-out forwards;
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
			/* Hold at the top for longer */
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
