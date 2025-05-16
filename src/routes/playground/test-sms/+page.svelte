<script lang="ts">
	let number = $state('')
	async function sendCode() {
		const response = await fetch('/playground/test-sms/send', {
			method: 'POST',
			body: JSON.stringify({
				number: '+1' + number
			})
		})

		const result = await response.json()

		if (!result?.success) {
			console.log('show error')
		}

		if (result?.success === true) {
			console.log('success')
		}
	}

	let code = $state('')
	async function verifyCode() {
		const response = await fetch('/playground/test-sms/verify', {
			method: 'POST',
			body: JSON.stringify({
				number: '+1' + number,
				code: code
			})
		})

		const result = await response.json()

		if (!result?.success) {
			console.log('show error')
		}

		if (result?.success === true) {
			console.log('success')
		}
	}
</script>

<input
	type="tel"
	bind:value={number}
	autofill="tel"
	name="phone-number"
	placeholder="Enter Your Phone Number"
/>
<button onclick={sendCode}>Send Code</button>

<input
	type="text"
	bind:value={code}
	autofill="one-time-code"
	name="verification-code"
	placeholder="Enter SMS Code"
/>
<button onclick={verifyCode}>Verify</button>
