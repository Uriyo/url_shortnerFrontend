import { Link } from 'lucide-react'

export default function Hero() {
	return (
		<section className="relative py-20 md:py-32 overflow-hidden mt-10">
			{/* Animated background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse" style={{ animationDuration: '8s' }} />
			
			{/* Decorative elements */}
			<div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
			<div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

			<div className="container mx-auto px-4 relative z-10">
				<div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
						<Link className="w-4 h-4 text-primary" />
						<span className="text-sm text-primary font-medium">Fast • Secure • Free</span>
					</div>

					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
						Simplify Your Links,
						<br />
						<span className="text-primary">Amplify Your Reach</span>
					</h1>

					<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
						Create short, memorable links in seconds. Track performance, generate QR codes, 
						and take control of your digital presence.
					</p>
				</div>

				{/* This will be filled by the ShortenerForm component */}
			</div>
		</section>
	)
}

