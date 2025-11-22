import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LinkIcon } from 'lucide-react'

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
			<div className="text-center space-y-6 px-4">
				<div className="flex justify-center">
					<div className="p-4 bg-primary/10 rounded-full">
						<LinkIcon className="w-16 h-16 text-primary" />
					</div>
				</div>
				<h1 className="text-6xl font-bold text-primary">404</h1>
				<h2 className="text-3xl font-semibold">Link Not Found</h2>
				<p className="text-muted-foreground max-w-md mx-auto">
					The short link you&apos;re looking for doesn&apos;t exist or has been deleted. 
					It may have expired or the URL might be incorrect.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
					<Link href="/">
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
							Go to Dashboard
						</Button>
					</Link>
					<Link href="/healthcheck">
						<Button variant="outline">
							Check System Status
						</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}

