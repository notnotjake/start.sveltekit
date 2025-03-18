/*
 * Utility functions for creating 'PromisedSettledResult' instances
 *
 * Provides methods to construct fulfilled and rejected promise results,
 * ensuring they resolve asynchronously
 */
export const PromiseSettledResult = {
	succeed: <A>(value: A): Promise<PromiseSettledResult<A>> => {
		return Promise.resolve({ status: 'fulfilled', value })
	},

	fail: (reason: unknown): Promise<PromiseRejectedResult> => {
		return Promise.resolve({ status: 'rejected', reason })
	}
}
