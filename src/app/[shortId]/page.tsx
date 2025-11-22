import { redirect, notFound } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!; 

export default async function RedirectHandler({ 
	params 
}: { 
	params: { shortId: string } 
}) {
	const { shortId } = params

	try {
		// Call the backend route without auto-following redirect
		const res = await fetch(`${API_BASE_URL}/${shortId}`, {
			redirect: 'manual',
			cache: 'no-store',
			headers: {
				'Accept': 'application/json, text/plain, */*',
			},
		})

		// Check if we got a redirect response (302, 301, 307, 308)
		if (res.status >= 300 && res.status < 400) {
			const location = res.headers.get('location')
			
			if (location) {
				// Redirect user to actual destination
				redirect(location)
			}
		}

		// If we get here and status is 404, show not found
		if (res.status === 404) {
			notFound()
		}

		// For any other status, try to parse response
		const contentType = res.headers.get('content-type')
		if (contentType?.includes('application/json')) {
			const data = await res.json()
			console.error('Unexpected response:', data)
		}

		// If no redirect happened, show 404
		notFound()
	} catch (error) {
		// Next.js redirects and notFound throw special errors - this is expected behavior
		// Only log if it's NOT a Next.js internal error
		if (error instanceof Error && 
			!error.message.includes('NEXT_REDIRECT') && 
			!error.message.includes('NEXT_NOT_FOUND')) {
			console.error('Redirect handler error:', error)
		}
		
		// If it's a Next.js internal error (redirect or notFound), let Next.js handle it
		if (error instanceof Error && 
			(error.message.includes('NEXT_REDIRECT') || error.message.includes('NEXT_NOT_FOUND'))) {
			throw error
		}
		
		// If it's a fetch error, the backend might be down
		// Show a more helpful error message
		return (
			<div className="container flex items-center justify-center min-h-screen mx-auto">
				<div className="text-center space-y-4 max-w-md">
					<h1 className="text-4xl font-bold text-foreground">Page not found</h1>
					<p className="text-muted-foreground">
						The page you are looking for does not exist.
					</p>
					<div className="pt-4">
						<a
							href="/"
							className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
						>
							Go to Dashboard
						</a>
					</div>
				</div>
			</div>
		)
	}
}

// Custom 404 page for this route
export async function generateMetadata({ params }: { params: { shortId: string } }) {
	return {
		title: `Redirect - ${params.shortId}`,
	}
}
