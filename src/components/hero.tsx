import { Link } from 'lucide-react'

export default function Hero() {
	return (
		<section className="relative py-12 sm:py-16 md:py-24 lg:py-32 overflow-hidden mt-8 sm:mt-10">
			{/* Animated background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" style={{ animationDuration: '8s' }} />
			
			{/* Decorative elements */}
			<div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
			<div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

			<div className="container mx-auto px-4 sm:px-6 relative z-10">
				<div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
						<Link className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
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
				</div>

				{/* This will be filled by the ShortenerForm component */}
			</div>
		</section>
	)
}

