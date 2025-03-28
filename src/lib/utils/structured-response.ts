export type StructuredResponse<T> =
	| { success: true; data: T; error?: never }
	| { success: false; data?: never; error: unknown }

export const StructuredResponse = {
	succeed: <T>(value: T): StructuredResponse<T> => {
		return { success: true, data: value }
	},

	fail: (error: string): StructuredResponse<never> => {
		return { success: false, error }
	}
}
