import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Helper function to use to mark non-tailwind classes to preserve
export const preserveClass = (classes: ClassValue) => ({ __preserved: classes })

export function createClass(...inputs: ClassValue[]) {
	// Filter out any preserved classes
	// Still runs clsx for preserved classes (so you can use conditionals)
	const preservedClasses: Array<string> = []
	const regularClasses = inputs.filter((input) => {
		if (input && typeof input === 'object' && '__preserved' in input) {
			preservedClasses.push(clsx(input.__preserved))
			return false
		}
		return true
	})

	return [twMerge(clsx(regularClasses)), ...preservedClasses].filter(Boolean).join(' ')
}
