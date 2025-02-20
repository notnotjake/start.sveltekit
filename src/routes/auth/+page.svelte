<script lang="ts">
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Auth Testing Page</h1>

	<form method="POST" action="?/sendMagicLinkEmail" use:enhance>
		<button class="rounded bg-blue-500 px-4 py-2 text-white">Send Magic Link Email</button>
	</form>

	<form method="POST" action="?/checkEmail" use:enhance>
		<label for="email">Email</label>
		<input type="email" name="email" id="email" autocomplete="email" placeholder="jonny@me.com" />
		<button>Submit</button>
	</form>
</div>
