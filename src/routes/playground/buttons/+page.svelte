<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import Button from '$ui/input/button.svelte'

	import MultiDeviceIcon from '$ui/icons/multi-device.svelte'
</script>

<Button
	style="ghost"
	onClick={(e) => {
		console.log('Clicked', e)
	}}>Edit</Button
>

<Button style="secondary" size="sm">Change Email</Button>

<Button style="outline" icon={MultiDeviceIcon}>Change Password</Button>

<Button style="primary">Logout</Button>

<Button style="primary" role="destructive">Delete Account</Button>

<Button style="link" class="font-normal" href="/login">Terms and Conditions</Button>

<Button style="primary" class="bg-blue-500 hover:bg-blue-600" size="xl">Go to Checkout</Button>
