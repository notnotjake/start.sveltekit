<script lang="ts">
	import Button from '$ui/input/button.svelte'

	import GoogleIcon from '$ui/icons/google.svelte'
	import AppleIcon from '$ui/icons/apple.svelte'
	import PasskeyIcon from '$ui/icons/passkey.svelte'
	import MultiDeviceIcon from '$ui/icons/multi-device.svelte'
</script>

<div class="w-full">
	<div class="providers flex w-full flex-col flex-nowrap gap-2">
		<div class="providers flex w-full flex-nowrap gap-2">
			<Button icon={GoogleIcon} suspense={false}>Google</Button>
			<Button icon={AppleIcon} suspense={false}>Apple</Button>
		</div>

		<div class="providers flex hidden w-full flex-nowrap gap-2">
			<Button icon={PasskeyIcon} suspense={false}>Passkey</Button>
			<Button icon={MultiDeviceIcon} suspense={false}>Scan QR</Button>
		</div>
	</div>
</div>
