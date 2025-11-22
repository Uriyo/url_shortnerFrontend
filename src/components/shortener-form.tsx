'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Copy, Check,Link2, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { api, ApiError } from '@/lib/api'
import { CreateLinkResponse } from '@/types/link'
import { Label } from '@/components/ui/label'

export default function ShortenerForm() {
	const [url, setUrl] = useState('')
	const [customCode, setCustomCode] = useState('')
	const [shortUrl, setShortUrl] = useState('')
	const [createdAt, setCreatedAt] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [copied, setCopied] = useState(false)
	const [activeTab, setActiveTab] = useState('shortlink')
	const [showCustomCode, setShowCustomCode] = useState(false)
	const { toast } = useToast()

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

		setIsLoading(true)
		
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
		} catch (error) {
			if (error instanceof ApiError) {
				// Handle specific error cases
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
			setIsLoading(false)
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
		<div className="w-full max-w-4xl mx-auto px-4">
			<Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4 sm:p-6 md:p-8 shadow-2xl">
				<div className="text-center mb-6 sm:mb-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
						Shorten a long link
					</h2>
					<p className="text-muted-foreground text-sm sm:text-base">No credit card required</p>
				</div>

				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
						<TabsTrigger value="shortlink" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
							<Link2 className="w-3 h-3 sm:w-4 sm:h-4" />
							<span className="hidden xs:inline">Short Link</span>
							<span className="xs:hidden">Link</span>
						</TabsTrigger>
						
					</TabsList>

					<TabsContent value="shortlink" className="space-y-4 sm:space-y-6">
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
									disabled={isLoading}
									className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap"
								>
									{isLoading ? 'Generating...' : 'Get your link for free'}
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
					</TabsContent>

					<TabsContent value="qrcode" className="space-y-4 sm:space-y-6">
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
									disabled={isLoading}
									className="h-12 sm:h-14 px-4 sm:px-6 md:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm sm:text-base md:text-lg whitespace-nowrap"
								>
									{isLoading ? 'Generating...' : 'Generate QR Code'}
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
									<Label htmlFor="customCode-qr" className="text-xs sm:text-sm text-muted-foreground">
										Custom back-half (optional)
									</Label>
									<Input
										id="customCode-qr"
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
							<div className="animate-fade-in mt-6 sm:mt-8 p-4 sm:p-6 md:p-8 bg-secondary/30 rounded-lg border border-border/50">
								<div className="flex flex-col items-center gap-4 sm:gap-6">
									<div className="text-center w-full">
										<p className="text-xs sm:text-sm text-muted-foreground mb-1">Your shortened URL:</p>
										<a 
											href={shortUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-base sm:text-lg md:text-xl font-semibold text-primary hover:text-primary/80 transition-colors break-all"
										>
											{shortUrl}
										</a>
									</div>
									<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
										<Button
											onClick={copyToClipboard}
											variant="outline"
											className="flex items-center gap-2 w-full sm:w-auto"
										>
											{copied ? (
												<>
													<Check className="w-4 h-4" />
													Copied!
												</>
											) : (
												<>
													<Copy className="w-4 h-4" />
													Copy Link
												</>
											)}
										</Button>
									</div>
								</div>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	)
}

