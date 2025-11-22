'use client'

import { Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

export default function Header() {
	return (
		<header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-4">
				<nav className="flex items-center justify-between">
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-2">
							<Link className="w-8 h-8 text-primary" />
							<span className="text-xl font-bold text-foreground">QuickLink</span>
						</div>
						
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="hidden md:flex items-center gap-1">
									Solutions
									<ChevronDown className="w-4 h-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>URL Shortener</DropdownMenuItem>
								<DropdownMenuItem>QR Codes</DropdownMenuItem>
								<DropdownMenuItem>Analytics</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center gap-4">
						<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
							EN
						</Button>
						<Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
							Sign up Free
						</Button>
					</div>
				</nav>
			</div>
		</header>
	)
}

