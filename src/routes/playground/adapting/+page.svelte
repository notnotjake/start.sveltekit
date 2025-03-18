<script lang="ts">
	import AdaptingContainer from '$ui/containers/adapting.svelte'
	import { Suspense } from '$ui/feedback'
	import { fade } from 'svelte/transition'
	import { cubicOut } from 'svelte/easing'

	let innerSize = $state(300)

	let formState = $state('start')

	function toggle() {
		if (formState === 'start') {
			formState = 'login'
		} else {
			formState = 'start'
		}
	}
</script>

<AdaptingContainer startingSize={300} class="rounded-[0.8rem] bg-neutral-100 p-3">
	{#if formState === 'start'}
		<div class="pt-8" in:fade={{ duration: 500, easing: cubicOut }}>
			<p>Login with Email</p>
			<input type="text" placeholder="email" />
			<p>Or continue with passkey</p>
			<button onclick={toggle}>Continue</button>
		</div>
	{:else}
		<div in:fade={{ duration: 500, easing: cubicOut }}>
			<Suspense.Text>Check inbox for email link</Suspense.Text>
			<button onclick={toggle}>Back</button>
		</div>
	{/if}
</AdaptingContainer>
