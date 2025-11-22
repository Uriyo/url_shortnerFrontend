'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Home, Link2, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from '@/components/ui/sheet'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const navigation = [
	{ name: 'Home', href: ROUTES.HOME, icon: Home },
	{ name: 'Dashboard', href: ROUTES.DASHBOARD, icon: Link2 },
	{ name: 'Health Check', href: ROUTES.HEALTHCHECK, icon: Activity },
]

export function SiteHeader() {
	const pathname = usePathname()

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 sm:h-16 items-center px-4 sm:px-6">
				<div className="mr-4 hidden md:flex">
					<Link href={ROUTES.HOME} className="mr-4 lg:mr-6 flex items-center space-x-2">
						<span className="hidden font-bold sm:inline-block text-primary text-base lg:text-lg">
							{APP_NAME}
						</span>
					</Link>
					<nav className="flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm font-medium">
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									'transition-colors hover:text-foreground/80',
									pathname === item.href
										? 'text-foreground'
										: 'text-foreground/60'
								)}
							>
								{item.name}
							</Link>
						))}
					</nav>
				</div>
				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
						>
							<Menu className="h-5 w-5 sm:h-6 sm:w-6" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="pr-0 w-[85vw] sm:w-[350px]">
						<Link
							href={ROUTES.HOME}
							className="flex items-center space-x-2"
						>
							<Link2 className="h-5 w-5 sm:h-6 sm:w-6" />
							<span className="font-bold text-sm sm:text-base">{APP_NAME}</span>
						</Link>
						<div className="my-4 h-[calc(100vh-8rem)] pb-10 overflow-y-auto">
							<div className="flex flex-col space-y-2 sm:space-y-3">
								{navigation.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className={cn(
											'flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-accent',
											pathname === item.href
												? 'bg-accent text-accent-foreground'
												: 'text-foreground/60'
										)}
									>
										<item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
										{item.name}
									</Link>
								))}
							</div>
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						<Link href={ROUTES.HOME} className="flex items-center space-x-2 md:hidden">
							<span className="font-bold text-sm sm:text-base">{APP_NAME}</span>
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}

