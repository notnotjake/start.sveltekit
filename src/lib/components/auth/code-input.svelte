<script lang="ts">
	import { tick } from 'svelte'
	import { goto } from '$app/navigation'
	import { createClass } from '$utils/styles'
	import PinCell from '$bits/auth/code-input-pin.svelte'
	import { SuspenseText } from '$ui/feedback'

	let { email }: { email: string } = $props()

	let enteredCode = $state('')
	let pinLength = $state(6) // Default number of pin cells

	let inputElement: HTMLInputElement = $state()
	let selectionStart = $state(0)
	let selectionEnd = $state(0)

	let submitSuccess: null | 'pending' | boolean = $state(null)

	let isComplete = $derived.by(() => {
		return enteredCode.length === pinLength
	})

	$effect(async () => {
		if (isComplete) {
			inputElement.blur()
			await trySubmit()
		}
	})

	// Handle pin code completion
	async function trySubmit() {
		try {
			submitSuccess = 'pending'

			const response = await fetch('/auth/magiclink/code-verify', {
				method: 'POST',
				body: JSON.stringify({
					email: email,
					code: enteredCode
				})
			})

			const result = await response.json()

			if (result.success && result.data) {
				goto(result.data)
			} else {
				submitSuccess = false
				enteredCode = ''
			}
		} catch (e) {
			console.log(e)
			submitSuccess = false
			enteredCode = ''
		}
	}

	function updateSelection() {
		if (inputElement) {
			selectionStart = inputElement.selectionStart || 0
			selectionEnd = inputElement.selectionEnd || 0
		}
	}

	async function handleInput(event) {
		if (submitSuccess === false) {
			submitSuccess = null
		}

		const input = event.target
		const value = input.value
		const currentStart = input.selectionStart || 0
		const currentEnd = input.selectionEnd || 0
		const isPaste = value.length > enteredCode.length + 1 || currentEnd - currentStart > 1

		// Handle paste operation
		if (isPaste) {
			// Take only numeric values and limit to pinLength
			const numericValue = value.replace(/[^0-9]/g, '').substring(0, pinLength)

			// Set the new value
			enteredCode = numericValue

			// Update the input field
			input.value = numericValue

			// Move cursor to the end or to the pinLength
			const newCursorPos = Math.min(numericValue.length, pinLength)
			await tick()
			input.setSelectionRange(newCursorPos, newCursorPos)

			// Update selection tracking
			selectionStart = newCursorPos
			selectionEnd = newCursorPos

			// Prevent default input behavior
			event.preventDefault()
		}
		// Handle single character input as before
		else if (value.length <= pinLength) {
			// If we're typing a new character (not deletion)
			if (value.length > enteredCode.length) {
				// This is what we type
				const lastTypedChar = value.charAt(currentStart - 1)

				// Create a new pin value that replaces the character at cursor position
				let newPin = enteredCode

				// If we're at the end, just append
				if (selectionStart >= enteredCode.length) {
					newPin = enteredCode + lastTypedChar
				} else {
					// Otherwise replace the character at cursor position
					newPin =
						enteredCode.substring(0, selectionStart) +
						lastTypedChar +
						enteredCode.substring(selectionStart + 1)
				}

				// Limit to pinLength
				newPin = newPin.substring(0, pinLength)

				// Set the new value
				enteredCode = newPin

				// Manually update the input value
				input.value = newPin

				// Move cursor to the next position (not to the end)
				const newCursorPos = Math.min(selectionStart + 1, pinLength)
				await tick()
				input.setSelectionRange(newCursorPos, newCursorPos)

				// Update our selection tracking
				selectionStart = newCursorPos
				selectionEnd = newCursorPos

				// Prevent default input behavior
				event.preventDefault()
			} else {
				// For deletion, let the browser handle it naturally
				enteredCode = value.substring(0, pinLength)
			}
		}

		// Update selection after changes
		updateSelection()
	}

	function handleKeydown(event) {
		// For arrow keys and other special keys, let the browser handle them
		// and then read the cursor position
		setTimeout(() => {
			updateSelection()
		}, 0)
	}

	function handleSelect(event) {
		updateSelection()
	}

	function handleFocus() {
		if (inputElement) {
			// Place cursor at the end or at first empty position
			const pos = enteredCode.length
			setTimeout(() => {
				inputElement.setSelectionRange(pos, pos)
				updateSelection()
			}, 0)
		}
	}
</script>

<div class="w-full">
	<div class="flex w-full flex-col items-center">
		<p class="text-center leading-4 font-medium tracking-tight text-neutral-600">
			Enter Verification Code
		</p>
		<p
			class={createClass(
				'text-center text-[0.95rem] font-medium tracking-tight text-rose-500',
				submitSuccess === false ? 'text-rose-500' : 'text-neutral-400'
			)}
		>
			{#if submitSuccess === false}
				The code couldn't be validated
			{:else}
				Enter the code generated from the email link
			{/if}
		</p>
		<div
			class={createClass(
				'group relative my-2 inline-block h-[2.8rem] rounded-[0.9rem] shadow-xs ring-[1px] ring-neutral-200/30 focus-within:ring-blue-500',
				isComplete && submitSuccess !== false
					? 'focus-within:ring-none bg-blue-100'
					: 'bg-white focus-within:ring-2'
			)}
		>
			<input
				type="text"
				bind:this={inputElement}
				value={enteredCode}
				oninput={handleInput}
				onkeydown={handleKeydown}
				onselect={handleSelect}
				onfocus={handleFocus}
				onclick={updateSelection}
				name="pin-input"
				inputmode="numeric"
				maxlength={pinLength}
				class="absolute top-0 left-0 h-full min-h-0 w-full min-w-0 cursor-pointer opacity-0"
			/>

			{#if isComplete && submitSuccess !== false}
				<div class="pointer-events-none flex h-full w-full items-center justify-center">
					<SuspenseText
						colorBase="var(--color-blue-500)"
						colorHighlight="var(--color-blue-300)"
						class="font-medium">Trying Code</SuspenseText
					>
				</div>
			{/if}

			<div
				class={createClass(
					'pointer-events-none flex h-full w-fit items-center rounded-[0.9rem] px-6',
					isComplete && submitSuccess !== false ? 'opacity-0' : 'opacity-100'
				)}
			>
				{#each Array(pinLength) as _, i}
					{#if i === 3}
						<p class="h-fit w-4 text-[1.15rem]">&nbsp;</p>
					{/if}
					<PinCell
						value={enteredCode[i] ?? ''}
						active={i === selectionStart && selectionStart === selectionEnd && !isComplete}
						selected={i >= selectionStart && i < selectionEnd}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>
