export interface Link {
	_id: string
	shortId: string
	redirectURL: string
	totalClicks: number
	lastAccessed: string | null
	createdAt: string
	updatedAt: string
	__v: number
}

export interface LinksResponse {
	page: number
	limit: number
	total: number
	totalPages: number
	data: Link[]
}

export interface CreateLinkRequest {
	url: string
	customCode?: string
}

export interface CreateLinkResponse {
	id: string
	shortURL: string
	createdAt: string
}

export interface LinkStats {
	totalClicks: number
	created_At: string
	last_acessed: string | null
	shortId: string
	redirectURL: string
}

export interface HealthCheckResponse {
	ok: boolean
	version: string
}

