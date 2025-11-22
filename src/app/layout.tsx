import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { FloatingNavbar } from '@/components/floating-navbar'


const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
	title: 'LinkSwift - Fast & Reliable URL Shortener',
	description: 'Create short, memorable links in seconds. Track performance and take control of your digital presence.',
	keywords: ['url shortener', 'link shortener', 'analytics'],
	authors: [{ name: 'LinkSwift' }],
	openGraph: {
		title: 'LinkSwift - URL Shortener',
		description: 'Create short, memorable links in seconds. Track performance and take control of your digital presence.',
		type: 'website',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<QueryProvider>
						<TooltipProvider>
							<FloatingNavbar />
							<main className="min-h-screen">
								{children}
							</main>
							<Toaster />
							<Sonner />
						</TooltipProvider>
					</QueryProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

