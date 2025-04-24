<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import Button from '$ui/input/button.svelte'

	import MultiDeviceIcon from '$ui/icons/multi-device.svelte'
</script>

<Button
	variant="ghost"
	onClick={(e) => {
		console.log('Clicked', e)
	}}>Edit</Button
>

<Button variant="secondary" size="sm">Change Email</Button>

<Button variant="outline" icon={MultiDeviceIcon}>Change Password</Button>

<Button variant="primary">Logout</Button>

<Button variant="primary" role="destructive">Delete Account</Button>

<Button variant="link" class="font-normal" href="/login">Terms and Conditions</Button>

<Button variant="primary" class="bg-blue-500 hover:bg-blue-600" size="xl">Go to Checkout</Button>
