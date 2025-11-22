import { DATE_FORMAT_OPTIONS } from './constants'

export function formatDate(dateString: string | null): string {
	if (!dateString) return 'Never'

	try {
		const date = new Date(dateString)
		if (isNaN(date.getTime())) return 'Invalid date'
		return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS)
	} catch {
		return 'Invalid date'
	}
}

export function formatRelativeTime(dateString: string | null): string {
	if (!dateString) return 'Never'

	try {
		const date = new Date(dateString)
		if (isNaN(date.getTime())) return 'Invalid date'

		const now = new Date()
		const diffMs = now.getTime() - date.getTime()
		const diffSec = Math.floor(diffMs / 1000)
		const diffMin = Math.floor(diffSec / 60)
		const diffHour = Math.floor(diffMin / 60)
		const diffDay = Math.floor(diffHour / 24)

		if (diffSec < 60) return 'Just now'
		if (diffMin < 60) return `${diffMin} min ago`
		if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
		if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`

		return formatDate(dateString)
	} catch {
		return 'Invalid date'
	}
}

export function truncateUrl(url: string, maxLength = 50): string {
	if (url.length <= maxLength) return url
	return `${url.slice(0, maxLength)}...`
}

export function formatUptime(uptimeSeconds: number): string {
	const days = Math.floor(uptimeSeconds / (24 * 60 * 60))
	const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60))
	const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60)
	const seconds = Math.floor(uptimeSeconds % 60)

	const parts: string[] = []
	if (days > 0) parts.push(`${days}d`)
	if (hours > 0) parts.push(`${hours}h`)
	if (minutes > 0) parts.push(`${minutes}m`)
	if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`)

	return parts.join(' ')
}

export function copyToClipboard(text: string): Promise<void> {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(text)
	}

	// Fallback for older browsers
	return new Promise((resolve, reject) => {
		const textArea = document.createElement('textarea')
		textArea.value = text
		textArea.style.position = 'fixed'
		textArea.style.left = '-999999px'
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()

		try {
			document.execCommand('copy')
			textArea.remove()
			resolve()
		} catch (err) {
			textArea.remove()
			reject(err)
		}
	})
}

