'use client'

import { useState } from 'react'
import { Copy, ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { formatRelativeTime, truncateUrl, copyToClipboard } from '@/lib/format'
import { Link as LinkType } from '@/types/link'

interface LinksTableProps {
	links: LinkType[]
	onDelete?: () => void
}

export function LinksTable({ links, onDelete }: LinksTableProps) {
	const [deleteId, setDeleteId] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)
	const { toast } = useToast()

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

	const handleDelete = async () => {
		if (!deleteId) return

		setIsDeleting(true)
		try {
			await api.deleteLink(deleteId)
			toast({
				title: 'Deleted',
				description: 'Link deleted successfully.',
			})
			onDelete?.()
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: error instanceof Error ? error.message : 'Failed to delete link',
			})
		} finally {
			setIsDeleting(false)
			setDeleteId(null)
		}
	}

	const getShortUrl = (shortId: string) => {
		const baseUrl = typeof window !== 'undefined' 
			? window.location.origin 
			: 'http://localhost:3000'
		return `${baseUrl}/${shortId}`
	}

	if (links.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<p className="text-lg font-medium text-gray-900 dark:text-gray-100">
					No links yet
				</p>
				<p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
					Create your first short link to get started
				</p>
			</div>
		)
	}

	return (
		<>
			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Short Code</TableHead>
							<TableHead>Short URL</TableHead>
							<TableHead>Target URL</TableHead>
							<TableHead className="text-center">Clicks</TableHead>
							<TableHead>Last Clicked</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{links.map((link) => (
							<TableRow key={link._id}>
								<TableCell className="font-medium">
									<code className="rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 text-sm">
										{link.shortId}
									</code>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<a
											href={getShortUrl(link.shortId)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:text-primary/80 hover:underline text-sm font-mono"
											title={getShortUrl(link.shortId)}
										>
											{truncateUrl(getShortUrl(link.shortId), 35)}
										</a>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => handleCopy(getShortUrl(link.shortId), 'Short URL')}
										>
											<Copy className="h-4 w-4" />
											<span className="sr-only">Copy short URL</span>
										</Button>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<a
											href={link.redirectURL}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
											title={link.redirectURL}
										>
											{truncateUrl(link.redirectURL, 40)}
										</a>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={() => handleCopy(link.redirectURL, 'Target URL')}
										>
											<Copy className="h-4 w-4" />
											<span className="sr-only">Copy target URL</span>
										</Button>
									</div>
								</TableCell>
								<TableCell className="text-center">
									<Badge variant={link.totalClicks > 0 ? 'default' : 'secondary'}>
										{link.totalClicks}
									</Badge>
								</TableCell>
								<TableCell className="text-sm text-gray-600 dark:text-gray-400">
									{formatRelativeTime(link.lastAccessed)}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={() => handleCopy(getShortUrl(link.shortId), 'Short URL')}
											>
												<Copy className="mr-2 h-4 w-4" />
												Copy short URL
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleCopy(link.redirectURL, 'Target URL')}
											>
												<Copy className="mr-2 h-4 w-4" />
												Copy target URL
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem asChild>
												<Link href={`/code/${link.shortId}`}>
													<ExternalLink className="mr-2 h-4 w-4" />
													View stats
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className="text-red-600 dark:text-red-400"
												onClick={() => setDeleteId(link.shortId)}
											>
												<Trash2 className="mr-2 h-4 w-4" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the short link
							and all associated analytics data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={isDeleting}
							className="bg-red-600 hover:bg-red-700"
						>
							{isDeleting ? 'Deleting...' : 'Delete'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

