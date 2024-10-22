<script lang="ts">
	import { page } from '$app/stores'

	const users = $page.data.users

	let response = false
	function handleSubmit({ result }) {
		response = result
	}

	let inputStyle = 'rounded-md bg-slate-200 px-2 py-1 placeholder-gray-500'
</script>

<form method="POST" use:enhance={{ result: handleSubmit }} class="flex gap-2 bg-slate-100 p-2 py-5">
	<input class={inputStyle} required type="text" name="username" placeholder="username" />
	<input class={inputStyle} required type="text" name="id" placeholder="id" />
	<select name="credential-type" id="credential-type">
		<option value="email">Email</option>
		<option value="phone">Phone</option>
	</select>
	<input class={inputStyle} required type="text" name="contact" placeholder="contact" />

	<button type="submit" class="text-blue-500">Add User</button>
</form>

{#if response}
	{#if response.success}
		<p class="text-green-400">{response.message}</p>
	{:else}
		<p class="text-orange-400">{response.message}</p>
	{/if}
{/if}

<h1>Users List:</h1>

{#each users as user}
	<p>Username: {user.field1} Id: {user.field2}</p>
{/each}
