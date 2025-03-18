export type StructuredResponse<T> =
	| { success: true; data: T; error?: never }
	| { success: false; data?: never; error: unknown }

export const StructuredResponse = {
	succeed: <T>(value: T): StructuredResponse<T> => {
		return { success: true, data: value }
	},

	fail: <T>(error: T): StructuredResponse<T> => {
		return { success: false, error: error }
	}
}

function testLoad() {
	const response = StructuredResponse.succeed({ username: 'john', age: 23 })

	return response
}

const result = testLoad()

if (result.success) {
	console.log(result.data.username)
}
