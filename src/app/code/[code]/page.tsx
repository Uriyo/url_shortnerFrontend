'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'
import { LinkStats } from '@/types/link'
import { formatDate, formatRelativeTime, copyToClipboard } from '@/lib/format'
import { ROUTES } from '@/lib/constants'
import { useToast } from '@/hooks/use-toast'

export default function StatsPage() {
	const params = useParams()
	const router = useRouter()
	const { toast } = useToast()
	const code = params.code as string

	const [stats, setStats] = useState<LinkStats | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStats = async () => {
			setIsLoading(true)
			setError(null)

			try {
				const data = await api.getLinkStats(code)
				setStats(data)
			} catch (err) {
				const errorMessage = err instanceof ApiError
					? err.message
					: 'Failed to load link stats. Please try again.'
				setError(errorMessage)
			} finally {
				setIsLoading(false)
			}
		}

		if (code) {
			fetchStats()
		}
	}, [code])

	const handleCopy = async (text: string, label: string) => {
		try {
			await copyToClipboard(text)
			toast({
				title: 'Copied!',
				description: `${label} copied to clipboard.`,
			})
		} catch {
			toast({
				variant: 'destructive',
				title: 'Failed',
				description: 'Could not copy to clipboard.',
			})
		}
	}

	const getShortUrl = () => {
		const baseUrl = typeof window !== 'undefined'
			? window.location.origin
			: 'http://localhost:3000'
		return `${baseUrl}/${code}`
	}

	if (isLoading) {
		return (
			<div className="container py-8 mx-auto mt-16">
				<div className="mb-6">
					<Skeleton className="h-8 w-48" />
				</div>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-32" />
					))}
				</div>
			</div>
		)
	}

	if (error || !stats) {
		return (
			<div className="container py-8 mx-auto mt-16">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="mb-6"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
					<CardHeader>
						<CardTitle className="text-red-900 dark:text-red-200">
							Error Loading Stats
						</CardTitle>
						<CardDescription className="text-red-700 dark:text-red-300">
							{error || 'Link not found'}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button onClick={() => router.push(ROUTES.HOME)}>
							Go to Dashboard
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="container py-8 mx-auto mt-16">
			<div className="mb-6 flex items-center justify-between">
				<Button
					variant="ghost"
					onClick={() => router.back()}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back
				</Button>
				<Link href={ROUTES.HOME}>
					<Button variant="outline">
						Go to Dashboard
					</Button>
				</Link>
			</div>

			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Link Statistics</h1>
				<p className="text-muted-foreground mt-2">
					Detailed analytics for your shortened link
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-4xl font-bold">{stats.totalClicks}</div>
						<p className="text-xs text-muted-foreground mt-2">
							All-time clicks on this link
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Created</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-semibold">
							{formatDate(stats.created_At)}
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							{formatRelativeTime(stats.created_At)}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium">Last Accessed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-semibold">
							{stats.last_acessed ? formatRelativeTime(stats.last_acessed) : 'Never'}
						</div>
						{stats.last_acessed && (
							<p className="text-xs text-muted-foreground mt-2">
								{formatDate(stats.last_acessed)}
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Short Link</CardTitle>
						<CardDescription>Your shortened URL</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<code className="flex-1 rounded bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm font-mono break-all">
								{getShortUrl()}
							</code>
							<Button
								variant="outline"
								size="icon"
								onClick={() => handleCopy(getShortUrl(), 'Short URL')}
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<div className="mt-4">
							<p className="text-sm font-medium mb-2">Short Code:</p>
							<code className="rounded bg-gray-100 dark:bg-gray-800 px-3 py-2 text-sm">
								{stats.shortId}
							</code>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Target URL</CardTitle>
						<CardDescription>Original destination</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 mb-4">
							<code className="flex-1 rounded bg-gray-100 dark:bg-gray-800 px-4 py-3 text-sm font-mono break-all">
								{stats.redirectURL}
							</code>
							<Button
								variant="outline"
								size="icon"
								onClick={() => handleCopy(stats.redirectURL, 'Target URL')}
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
						<Button
							variant="outline"
							size="sm"
							asChild
							className="w-full"
						>
							<a
								href={stats.redirectURL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Open Target URL
							</a>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

