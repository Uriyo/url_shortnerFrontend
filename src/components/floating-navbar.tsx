'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, Menu, X, Activity, Link2 } from 'lucide-react'

export function FloatingNavbar() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const navLinks = [
		{ href: '/', label: 'Dashboard', icon: BarChart3 },
		{ href: '/healthcheck', label: 'Health Check', icon: Activity },
	]

	return (
		<>
			{/* Floating Navbar */}
			<header
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
					isScrolled ? 'py-2' : 'py-3 sm:py-4'
				}`}
			>
				<nav
					className={`container mx-auto px-3 sm:px-4 transition-all duration-500 ${
						isScrolled ? 'max-w-6xl' : 'max-w-7xl'
					}`}
				>
					<div
						className={`relative backdrop-blur-xl bg-background/40 border border-white/10 rounded-full shadow-2xl transition-all duration-500 ${
							isScrolled
								? 'shadow-primary/5 border-primary/10'
								: 'shadow-black/20'
						}`}
					>
						{/* Animated gradient border effect */}
						<div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

						{/* Main navbar content */}
						<div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3">
							{/* Logo */}
							<Link
								href="/"
								className="flex items-center gap-1.5 sm:gap-2 group relative z-10"
							>
								<div className="relative">
									<div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all duration-300" />
									<div className="relative bg-gradient-to-br from-primary to-orange-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
										<Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
									</div>
								</div>
								<span className="font-bold text-lg sm:text-xl text-primary hidden xs:block">
								</span>
							</Link>

							{/* Desktop Navigation */}
							<div className="hidden md:flex items-center gap-2">
								{navLinks.map((link) => (
									<Link
										key={link.href}
										href={link.href}
										className="relative px-3 lg:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 group"
									>
										<span className="relative z-10 flex items-center gap-2">
											<link.icon className="w-4 h-4" />
											{link.label}
										</span>
										<div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
									</Link>
								))}
							</div>

							{/* CTA Button - Desktop */}
							<div className="hidden md:flex items-center gap-3">
								
							</div>

							{/* Mobile Menu Button */}
							<button
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className="md:hidden p-1.5 sm:p-2 text-foreground hover:text-primary transition-colors rounded-lg"
								aria-label="Toggle menu"
							>
								{isMobileMenuOpen ? (
									<X className="w-5 h-5 sm:w-6 sm:h-6" />
								) : (
									<Menu className="w-5 h-5 sm:w-6 sm:h-6" />
								)}
							</button>
						</div>
					</div>
				</nav>

				{/* Mobile Menu */}
				<div
					className={`md:hidden container mx-auto px-3 sm:px-4 transition-all duration-500 overflow-hidden ${
						isMobileMenuOpen
							? 'max-h-96 opacity-100 mt-2'
							: 'max-h-0 opacity-0'
					}`}
				>
					<div className="backdrop-blur-xl bg-background/40 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4">
						<div className="flex flex-col gap-1.5 sm:gap-2">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-lg sm:rounded-xl transition-all duration-300"
								>
									<link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
									{link.label}
								</Link>
							))}
							<div className="h-px bg-border my-1 sm:my-2" />
							
						</div>
					</div>
				</div>
			</header>

			{/* Add custom shimmer animation to globals.css */}
			<style jsx global>{`
				@keyframes shimmer {
					0% {
						background-position: -200% center;
					}
					100% {
						background-position: 200% center;
					}
				}
				.animate-shimmer {
					animation: shimmer 8s linear infinite;
				}
			`}</style>
		</>
	)
}

