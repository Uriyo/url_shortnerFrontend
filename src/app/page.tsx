'use client'

import { useEffect, useState } from 'react'
import { Search, Loader2, RefreshCw, Link2, Sparkles, Copy, Check, Zap, BarChart3, Shield } from 'lucide-react'

import { AddLinkDialog } from '@/components/add-link-dialog'
import { LinksTable } from '@/components/links-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { api, ApiError } from '@/lib/api'
import { Link, LinksResponse, CreateLinkResponse } from '@/types/link'
import { ITEMS_PER_PAGE } from '@/lib/constants'

export default function DashboardPage() {
	const { toast } = useToast()
	
	// Hero/Shortener state
	const [url, setUrl] = useState('')
	const [customCode, setCustomCode] = useState('')
	const [shortUrl, setShortUrl] = useState('')
	const [createdAt, setCreatedAt] = useState('')
	const [isShortening, setIsShortening] = useState(false)
	const [copied, setCopied] = useState(false)
	const [showCustomCode, setShowCustomCode] = useState(false)
	
	// Dashboard state
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

	const generateShortUrl = async () => {
		if (!url) {
			toast({
				title: 'Error',
				description: 'Please enter a URL to shorten',
				variant: 'destructive',
			})
			return
		}

		// Basic URL validation
		try {
			new URL(url)
		} catch {
			toast({
				title: 'Invalid URL',
				description: 'Please enter a valid URL starting with http:// or https://',
				variant: 'destructive',
			})
			return
		}

		setIsShortening(true)
		
		try {
			const response: CreateLinkResponse = await api.createLink({
				url,
				...(customCode && { customCode }),
			})

			setShortUrl(response.shortURL)
			setCreatedAt(response.createdAt)
			
			toast({
				title: 'Success!',
				description: 'Your link has been shortened',
			})
			
			// Refresh the links table
			fetchLinks()
		} catch (error) {
			if (error instanceof ApiError) {
				if (error.status === 409) {
					toast({
						title: 'Custom Code Unavailable',
						description: 'This custom code is already in use. Please try another one.',
						variant: 'destructive',
					})
				} else if (error.status === 400) {
					toast({
						title: 'Invalid Request',
						description: error.message || 'Please check your input and try again.',
						variant: 'destructive',
					})
				} else {
					toast({
						title: 'Error',
						description: error.message || 'Failed to shorten URL. Please try again.',
						variant: 'destructive',
					})
				}
			} else {
				toast({
					title: 'Network Error',
					description: 'Unable to connect to the server. Please try again later.',
					variant: 'destructive',
				})
			}
		} finally {
			setIsShortening(false)
		}
	}

	const copyToClipboard = () => {
		navigator.clipboard.writeText(shortUrl)
		setCopied(true)
		
		toast({
			title: 'Copied!',
			description: 'Short URL copied to clipboard',
		})

		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<>
			{/* Hero Section */}
			<section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden mt-8 sm:mt-10">
				{/* Animated background gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" style={{ animationDuration: '8s' }} />
				
				{/* Decorative elements */}
				<div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
				<div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

				<div className="container mx-auto px-4 sm:px-6 relative z-10">
					<div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 animate-fade-in">
						<div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
							<Link2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
							<span className="text-xs sm:text-sm text-primary font-medium">Fast • Secure • Free</span>
						</div>

						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
							Simplify Your Links,
							<br />
							<span className="text-primary">Amplify Your Reach</span>
						</h1>

						<p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
							Create short, memorable links in seconds. Track performance 
							and take control of your digital presence.
						</p>

						{/* Features */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-3xl mx-auto">
							<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
								<Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
								<h3 className="font-semibold text-sm sm:text-base">Lightning Fast</h3>
								<p className="text-xs sm:text-sm text-muted-foreground">Instant link generation</p>
							</div>
							<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
								<BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
								<h3 className="font-semibold text-sm sm:text-base">Analytics</h3>
								<p className="text-xs sm:text-sm text-muted-foreground">Track click statistics</p>
							</div>
							<div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
								<Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
								<h3 className="font-semibold text-sm sm:text-base">Secure</h3>
								<p className="text-xs sm:text-sm text-muted-foreground">Safe and reliable</p>
							</div>
						</div>
					</div>

					{/* Shortener Form */}
					<div className="w-full max-w-4xl mx-auto px-4">
						<Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4 sm:p-6 md:p-8 shadow-2xl">
							<div className="space-y-4 sm:space-y-6">
								<div className="space-y-3 sm:space-y-4">
									<div className="flex flex-col md:flex-row gap-2 sm:gap-3">
										<Input
											type="url"
											placeholder="https://example.com/your-long-url"
											value={url}
											onChange={(e) => setUrl(e.target.value)}
											onKeyDown={(e) => e.key === 'Enter' && generateShortUrl()}
											className="flex-1 h-12 sm:h-14 text-sm sm:text-base md:text-lg bg-background/50 border-border/50"
										/>
										<Button
											onClick={generateShortUrl}
											disabled={isShortening}
											className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap"
										>
											{isShortening ? 'Generating...' : 'Shorten URL'}
										</Button>
									</div>

									{/* Custom Code Toggle */}
									<div className="flex items-center justify-between">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => setShowCustomCode(!showCustomCode)}
											className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
										>
											<Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
											{showCustomCode ? 'Hide' : 'Customize your link'}
										</Button>
									</div>

									{/* Custom Code Input */}
									{showCustomCode && (
										<div className="animate-fade-in space-y-2">
											<Label htmlFor="customCode" className="text-xs sm:text-sm text-muted-foreground">
												Custom back-half (optional)
											</Label>
											<Input
												id="customCode"
												type="text"
												placeholder="my-custom-link"
												value={customCode}
												onChange={(e) => setCustomCode(e.target.value)}
												onKeyDown={(e) => e.key === 'Enter' && generateShortUrl()}
												className="h-10 sm:h-12 bg-background/50 border-border/50 text-sm sm:text-base"
												maxLength={20}
											/>
											<p className="text-xs text-muted-foreground">
												Letters, numbers only (6-8 characters)
											</p>
										</div>
									)}
								</div>

								{shortUrl && (
									<div className="animate-fade-in mt-6 sm:mt-8 p-4 sm:p-6 bg-secondary/30 rounded-lg border border-border/50">
										<div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-4">
											<div className="flex-1 min-w-0 w-full">
												<p className="text-xs sm:text-sm text-muted-foreground mb-1">Your shortened URL:</p>
												<a 
													href={shortUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-base sm:text-lg md:text-xl font-semibold text-primary hover:text-primary/80 transition-colors truncate block"
												>
													{shortUrl}
												</a>
											</div>
											<Button
												onClick={copyToClipboard}
												variant="outline"
												className="flex items-center gap-2 w-full sm:w-auto shrink-0"
											>
												{copied ? (
													<>
														<Check className="w-4 h-4" />
														Copied!
													</>
												) : (
													<>
														<Copy className="w-4 h-4" />
														Copy
													</>
												)}
											</Button>
										</div>

										<div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border/50">
											<div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
												<div>
													<p className="text-xl sm:text-2xl font-bold text-foreground">0</p>
													<p className="text-xs sm:text-sm text-muted-foreground">Clicks</p>
												</div>
												<div>
													<p className="text-base sm:text-lg md:text-2xl font-bold text-foreground">
														{new Date(createdAt).toLocaleDateString('en-US', { 
															month: 'short', 
															day: 'numeric',
															year: 'numeric' 
														})}
													</p>
													<p className="text-xs sm:text-sm text-muted-foreground">Created</p>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						</Card>
					</div>
				</div>
			</section>

			{/* Dashboard Section */}
			<div className="container py-6 sm:py-8 mx-auto px-4 sm:px-6">
				<div className="mb-6 sm:mb-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Links</h2>
						<p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
							Manage your shortened links
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={handleRefresh}
							disabled={isLoading}
							className="flex-1 sm:flex-none"
						>
							<RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
							<span className="hidden sm:inline">Refresh</span>
						</Button>
						<AddLinkDialog onSuccess={handleSuccess} />
					</div>
				</div>

				<div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row">
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
							<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
									Showing {data.data.length} of {data.total} links
									{searchQuery && ` (filtered: ${filteredLinks.length})`}
								</p>
								<div className="flex items-center justify-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
									>
										Previous
									</Button>
									<div className="flex items-center gap-2 min-w-[100px] justify-center">
										<span className="text-xs sm:text-sm whitespace-nowrap">
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
		</>
	)
}

