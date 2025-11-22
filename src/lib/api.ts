import {
	CreateLinkRequest,
	CreateLinkResponse,
	HealthCheckResponse,
	LinksResponse,
	LinkStats,
} from '@/types/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'

class ApiError extends Error {
	constructor(
		message: string,
		public status?: number,
		public data?: unknown
	) {
		super(message)
		this.name = 'ApiError'
	}
}

async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			...options,
		})

		if (!response.ok) {
			const errorData = await response.json().catch(() => null)
			
			// Extract error message from various possible locations
			const errorMessage = 
				errorData?.message || 
				errorData?.error || 
				errorData?.msg ||
				(typeof errorData === 'string' ? errorData : null) ||
				`HTTP error ${response.status}`
			
			throw new ApiError(
				errorMessage,
				response.status,
				errorData
			)
		}

		return await response.json()
	} catch (error) {
		if (error instanceof ApiError) {
			throw error
		}
		throw new ApiError(
			error instanceof Error ? error.message : 'Network error occurred'
		)
	}
}

export const api = {
	// Get all links with pagination
	getLinks: async (page = 1, limit = 10): Promise<LinksResponse> => {
		return fetchApi<LinksResponse>(`/api/links?page=${page}&limit=${limit}`)
	},

	// Get stats for a specific link
	getLinkStats: async (shortId: string): Promise<LinkStats> => {
		return fetchApi<LinkStats>(`/api/links/${shortId}`)
	},

	// Create a new short link
	createLink: async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
		const response = await fetchApi<CreateLinkResponse>('/api/links', {
			method: 'POST',
			body: JSON.stringify(data),
		})
		
		// Replace backend URL with frontend URL
		if (response.shortURL) {
			response.shortURL = response.shortURL.replace(API_BASE_URL, APP_BASE_URL)
		}
		
		return response
	},

	// Delete a link
	deleteLink: async (shortId: string): Promise<void> => {
		return fetchApi<void>(`/api/links/${shortId}`, {
			method: 'DELETE',
		})
	},

	// Health check
	healthCheck: async (): Promise<HealthCheckResponse> => {
		return fetchApi<HealthCheckResponse>('/healthz')
	},
}

export { ApiError }

