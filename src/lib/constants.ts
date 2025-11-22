export const APP_NAME = 'LinkSwift'
export const APP_DESCRIPTION = 'Fast and reliable URL shortener'
export const APP_BASE_URL = typeof window !== 'undefined' 
	? window.location.origin 
	: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export const ROUTES = {
	HOME: '/dashboard',
	DASHBOARD: '/dashboard',
	STATS: '/stats',
	HEALTHCHECK: '/healthcheck',
} as const

export const ITEMS_PER_PAGE = 10

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
}

export const VALIDATION_MESSAGES = {
	URL_REQUIRED: 'URL is required',
	URL_INVALID: 'Please enter a valid URL starting with http:// or https://',
	CUSTOM_CODE_MIN: 'Custom code must be at least 3 characters',
	CUSTOM_CODE_MAX: 'Custom code must be less than 20 characters',
	CUSTOM_CODE_PATTERN: 'Custom code can only contain letters, numbers, hyphens, and underscores',
} as const

