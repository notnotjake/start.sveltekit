<script lang="ts">
	import { superForm } from 'sveltekit-superforms'
	import { zodClient } from 'sveltekit-superforms/adapters'
	import { goto } from '$app/navigation'
	import { wipeVertical } from '$ui/transition'
	import Button from '$ui/input/button.svelte'

	let { data } = $props()
</script>

<div class="mx-auto mt-30 flex max-w-90 flex-col items-center justify-center">
	<div class=" w-full flex-col items-center justify-center px-7 py-5 text-center">
		<h2 class="tracking-tight-md animate-fade-in-scale text-[1.33rem] leading-loose font-[550]">
			Add Two Factor
		</h2>

		<form method="POST" class="w-full" action="?/enroll2fa">
			<Button type="submit">Add 2FA</Button>
		</form>

		<form method="POST" class="w-full" action="?/verify2faCode">
			<input
				type="text"
				name="code"
				id="code"
				placeholder="2fa code"
				autocomplete="one-time-code"
			/>

			<Button type="submit">Submit Code</Button>
		</form>
	</div>
</div>
