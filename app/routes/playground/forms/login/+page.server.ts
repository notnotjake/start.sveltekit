import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { message } from 'sveltekit-superforms'
import { fail } from '@sveltejs/kit'
import { z } from 'zod'

const email = z.object({
	email: z.string().email('Email not accepted')
})

export const load: ServerLoad = async () => {
	const form = await superValidate(zod(email))

	return { form }
}

export const actions: Actions = {
	default: async ({ request }) => {
		await new Promise((resolve) => setTimeout(resolve, 5000))

		const form = await superValidate(request, zod(email))
		console.log(form)

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return fail(400, { form })
		} else {
			console.log(form.data)
		}

		if (form.data.email === 'jake@notnotjake.com') {
			return setError(form, 'email', 'Email already exists')
		}

		// TODO: Do something with the validated form.data

		// Display a success status message

		return message(form, 'Form posted successfully!')
	}
}
