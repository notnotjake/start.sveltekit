import type { Actions, ServerLoad } from '@sveltejs/kit'
import { superValidate, setError, message } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'
import { z } from 'zod'
import { fail, redirect } from '@sveltejs/kit'

const schema = z.object({
	emailEnabled: z.boolean()
})

let buttonValue = true

export const load: ServerLoad = async (event) => {
	const form = await superValidate(zod(schema))

	return { form }
}

export const actions: Actions = {
	changeEmailEnabled: async (event) => {
		const form = await superValidate(event.request, zod(schema))
		if (!form.valid) return fail(400, { form })

		console.log(form.data)

		return message(form, { success: true })
	}
}
