'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api, ApiError } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { VALIDATION_MESSAGES } from '@/lib/constants'

const formSchema = z.object({
	url: z
		.string()
		.min(1, VALIDATION_MESSAGES.URL_REQUIRED)
		.url(VALIDATION_MESSAGES.URL_INVALID),
	customCode: z
		.string()
		.optional()
		.refine(
			(val) => !val || (val.length >= 3 && val.length <= 20),
			{
				message: 'Custom code must be between 3 and 20 characters',
			}
		)
		.refine(
			(val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
			{
				message: VALIDATION_MESSAGES.CUSTOM_CODE_PATTERN,
			}
		),
})

type FormData = z.infer<typeof formSchema>

interface AddLinkDialogProps {
	onSuccess?: () => void
}

export function AddLinkDialog({ onSuccess }: AddLinkDialogProps) {
	const [isOpen, setIsOpen] = useState(false)
	const { toast } = useToast()

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: '',
			customCode: '',
		},
	})

	const onSubmit = async (data: FormData) => {
		try {
			const response = await api.createLink({
				url: data.url,
				customCode: data.customCode || undefined,
			})


			toast({
				title: 'Success!',
				description: 'Short link created successfully.',
			})

			// Copy to clipboard
			try {
				await navigator.clipboard.writeText(response.shortURL)
				toast({
					title: 'Copied!',
					description: 'Short URL copied to clipboard.',
				})
			} catch {
				// Silently fail clipboard operation
			}

			form.reset()
			setIsOpen(false)
			onSuccess?.()
		} catch (error) {
			// Log error for debugging
			console.error('Error creating link:', error)
			
			// Handle specific error cases
			if (error instanceof ApiError) {
				if (error.status === 409) {
					toast({
						variant: 'destructive',
						title: 'Custom Code Already Taken',
						description: `The custom code "${data.customCode}" is already in use. Please try a different one or leave it blank for auto-generation.`,
					})
				} else if (error.status === 400) {
					// Check if it's a URL validation error
					const errorMessage = (error.message || '').toLowerCase()
					const errorDataStr = JSON.stringify(error.data || {}).toLowerCase()
					
					console.log('400 Error details:', { message: error.message, data: error.data })
					
					// Check for URL-related errors
					if (errorMessage.includes('url') || 
						errorMessage.includes('invalid') || 
						errorDataStr.includes('url') ||
						errorDataStr.includes('invalid')) {
						toast({
							variant: 'destructive',
							title: 'Invalid URL',
							description: 'Please enter a valid URL starting with http:// or https://. Example: https://example.com',
						})
					} 
					// Check for custom code errors
					else if (errorMessage.includes('code') || 
							 errorMessage.includes('custom') ||
							 errorDataStr.includes('code')) {
						toast({
							variant: 'destructive',
							title: 'Invalid Custom Code',
							description: 'Custom code must be 6-8 characters long and contain only letters and numbers.',
						})
					} 
					// Default 400 error
					else {
						toast({
							variant: 'destructive',
							title: 'Invalid Request',
							description: error.message || 'Please check your input and try again.',
						})
					}
				} else {
					toast({
						variant: 'destructive',
						title: 'Error',
						description: error.message || 'Failed to create short link. Please try again.',
					})
				}
			} else {
				toast({
					variant: 'destructive',
					title: 'Network Error',
					description: 'Unable to connect to the server. Please try again later.',
				})
			}
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					Add Link
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[525px]">
				<DialogHeader>
					<DialogTitle>Create Short Link</DialogTitle>
					<DialogDescription>
						Enter the URL you want to shorten. Optionally provide a custom code.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Target URL</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com/your-long-url"
											type="url"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Enter a valid URL starting with http:// or https://
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="customCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Custom Code (Optional)</FormLabel>
									<FormControl>
										<Input
											placeholder="my-custom-code"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Custom short code (6-8 characters, letters, numbers)
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Create Link
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

