'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2, RefreshCw } from 'lucide-react'

import { AddLinkDialog } from '@/components/add-link-dialog'
import { LinksTable } from '@/components/links-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { api, ApiError } from '@/lib/api'
import { Link, LinksResponse } from '@/types/link'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export default function DashboardPage() {
	const [data, setData] = useState<LinksResponse | null>(null)
	const [filteredLinks, setFilteredLinks] = useState<Link[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE)

	const fetchLinks = async () => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await api.getLinks(currentPage, itemsPerPage)
			setData(response)
			setFilteredLinks(response.data)
		} catch (err) {
			const errorMessage = err instanceof ApiError 
				? err.message 
				: 'Failed to load links. Please try again.'
			setError(errorMessage)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchLinks()
	}, [currentPage, itemsPerPage])

	useEffect(() => {
		if (!data) return

		if (!searchQuery.trim()) {
			setFilteredLinks(data.data)
			return
		}

		const query = searchQuery.toLowerCase()
		const filtered = data.data.filter(
			(link) =>
				link.shortId.toLowerCase().includes(query) ||
				link.redirectURL.toLowerCase().includes(query)
		)
		setFilteredLinks(filtered)
	}, [searchQuery, data])

	const handleRefresh = () => {
		fetchLinks()
	}

	const handleSuccess = () => {
		// Reset to first page and refresh
		setCurrentPage(1)
		fetchLinks()
	}

	return (
		<div className="container py-8 mx-auto mt-16">
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground mt-2">
						Manage your shortened links
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleRefresh}
						disabled={isLoading}
					>
						<RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
						Refresh
					</Button>
					<AddLinkDialog onSuccess={handleSuccess} />
				</div>
			</div>

			<div className="mb-6 flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search by code or URL..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select
					value={itemsPerPage.toString()}
					onValueChange={(value) => {
						setItemsPerPage(Number(value))
						setCurrentPage(1)
					}}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Items per page" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="5">5 per page</SelectItem>
						<SelectItem value="10">10 per page</SelectItem>
						<SelectItem value="20">20 per page</SelectItem>
						<SelectItem value="50">50 per page</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{isLoading && (
				<div className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center gap-4">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">Loading links...</p>
					</div>
				</div>
			)}

			{error && !isLoading && (
				<div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
					<div className="flex items-start gap-4">
						<div className="flex-1">
							<h3 className="font-semibold text-red-900 dark:text-red-200">
								Error Loading Links
							</h3>
							<p className="mt-2 text-sm text-red-700 dark:text-red-300">
								{error}
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={handleRefresh}
							className="shrink-0"
						>
							Try Again
						</Button>
					</div>
				</div>
			)}

			{!isLoading && !error && (
				<>
					<LinksTable links={filteredLinks} onDelete={handleRefresh} />

					{data && data.totalPages > 1 && (
						<div className="mt-6 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								Showing {data.data.length} of {data.total} links
								{searchQuery && ` (filtered: ${filteredLinks.length})`}
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}
								>
									Previous
								</Button>
								<div className="flex items-center gap-2">
									<span className="text-sm">
										Page {currentPage} of {data.totalPages}
									</span>
								</div>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
									disabled={currentPage === data.totalPages}
								>
									Next
								</Button>
							</div>
						</div>
					)}
				</>
			)}
		</div>
	)
}

