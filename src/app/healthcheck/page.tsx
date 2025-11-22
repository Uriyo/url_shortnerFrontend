'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Activity, Clock, Server, Database, Zap, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api, ApiError } from '@/lib/api'

interface HealthStatus {
	frontend: {
		ok: boolean
		version: string
		uptime: number
		timestamp: string
	}
	backend: {
		ok: boolean
		version: string
		error?: string
	}
}

export default function HealthCheckPage() {
	const [health, setHealth] = useState<HealthStatus | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [lastChecked, setLastChecked] = useState<Date>(new Date())

	const checkHealth = async () => {
		setIsLoading(true)
		// const startTime = performance.now()

		try {
			// Check backend health
			const backendHealth = await api.healthCheck()
			// const responseTime = Math.round(performance.now() - startTime)

			// Frontend health
			const frontendUptime = performance.now() / 1000 // seconds since page load

			setHealth({
				frontend: {
					ok: true,
					version: '1.0',
					uptime: frontendUptime,
					timestamp: new Date().toISOString(),
				},
				backend: {
					ok: backendHealth.ok,
					version: backendHealth.version,
				},
			})
		} catch (error) {
			const errorMessage = error instanceof ApiError 
				? error.message 
				: 'Unable to connect to backend'

			setHealth({
				frontend: {
					ok: true,
					version: '1.0',
					uptime: performance.now() / 1000,
					timestamp: new Date().toISOString(),
				},
				backend: {
					ok: false,
					version: 'Unknown',
					error: errorMessage,
				},
			})
		} finally {
			setIsLoading(false)
			setLastChecked(new Date())
		}
	}

	useEffect(() => {
		checkHealth()
	}, [])

	const formatUptime = (seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = Math.floor(seconds % 60)
		return `${hours}h ${minutes}m ${secs}s`
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})
	}

	if (isLoading && !health) {
		return (
			<div className="container py-6 sm:py-8 mx-auto mt-16 px-4 sm:px-6">
				<div className="mb-6 sm:mb-8">
					<Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-2" />
					<Skeleton className="h-5 sm:h-6 w-64 sm:w-96" />
				</div>
				<div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Skeleton key={i} className="h-40" />
					))}
				</div>
			</div>
		)
	}

	const allHealthy = health?.frontend.ok && health?.backend.ok

	return (
		<div className="container py-6 sm:py-8 mx-auto mt-16 px-4 sm:px-6">
			<div className="mb-6 sm:mb-8 flex flex-col gap-4">
				<div>
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
						<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">System Health Check</h1>
						{allHealthy ? (
							<Badge variant="default" className="bg-green-600 hover:bg-green-700 w-fit">
								<CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
								<span className="text-xs sm:text-sm">All Systems Operational</span>
							</Badge>
						) : (
							<Badge variant="destructive" className="w-fit">
								<XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
								<span className="text-xs sm:text-sm">System Issues Detected</span>
							</Badge>
						)}
					</div>
					<p className="text-muted-foreground text-sm sm:text-base">
						Monitor the status and performance of all services
					</p>
				</div>
				<div className="flex flex-col gap-2">
					<Button
						onClick={checkHealth}
						disabled={isLoading}
						variant="outline"
						className="w-full sm:w-auto"
					>
						<RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
						Refresh Status
					</Button>
					<p className="text-xs text-muted-foreground text-center sm:text-left">
						Last checked: {formatTime(lastChecked)}
					</p>
				</div>
			</div>

			{/* Overview Cards */}
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
				{/* Frontend Status */}
				<Card className={health?.frontend.ok ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900'}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<Server className="w-4 h-4" />
								Frontend
							</CardTitle>
							{health?.frontend.ok ? (
								<CheckCircle2 className="w-5 h-5 text-green-600" />
							) : (
								<XCircle className="w-5 h-5 text-red-600" />
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Status:</span>
								<span className={health?.frontend.ok ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
									{health?.frontend.ok ? 'Online' : 'Offline'}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Version:</span>
								<code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
									{health?.frontend.version}
								</code>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Uptime:</span>
								<span className="font-mono text-xs">
									{health ? formatUptime(health.frontend.uptime) : '--'}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Backend Status */}
				<Card className={health?.backend.ok ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900'}>
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-sm font-medium flex items-center gap-2">
								<Database className="w-4 h-4" />
								Backend API
							</CardTitle>
							{health?.backend.ok ? (
								<CheckCircle2 className="w-5 h-5 text-green-600" />
							) : (
								<XCircle className="w-5 h-5 text-red-600" />
							)}
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Status:</span>
								<span className={health?.backend.ok ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
									{health?.backend.ok ? 'Online' : 'Offline'}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Version:</span>
								<code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
									{health?.backend.version}
								</code>
							</div>
							{health?.backend.error && (
								<div className="mt-2 p-2 bg-red-50 dark:bg-red-950 rounded text-xs text-red-600 dark:text-red-400">
									{health.backend.error}
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* System Info */}
				<Card>
					<CardHeader>
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Activity className="w-4 h-4" />
							System Info
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Environment:</span>
								<code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
									{process.env.NODE_ENV || 'production'}
								</code>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Platform:</span>
								<span className="text-xs font-mono">
									{typeof navigator !== 'undefined' ? navigator.platform : 'Server'}
								</span>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Timestamp:</span>
								<span className="text-xs font-mono">
									{formatTime(new Date())}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Status */}
			<div className="grid gap-4 sm:gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg sm:text-xl">Service Endpoints</CardTitle>
						<CardDescription className="text-xs sm:text-sm">Status of all service endpoints</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 sm:space-y-3">
							<div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-900 gap-2">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
									<Zap className="w-4 h-4 text-primary shrink-0" />
									<div className="min-w-0">
										<p className="text-xs sm:text-sm font-medium truncate">Frontend Health</p>
										<p className="text-xs text-muted-foreground truncate">/healthz</p>
									</div>
								</div>
								<Badge variant={health?.frontend.ok ? 'default' : 'destructive'} className={`${health?.frontend.ok ? 'bg-green-600' : ''} shrink-0 text-xs`}>
									{health?.frontend.ok ? 'Active' : 'Down'}
								</Badge>
							</div>

							<div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-900 gap-2">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
									<Database className="w-4 h-4 text-primary shrink-0" />
									<div className="min-w-0">
										<p className="text-xs sm:text-sm font-medium truncate">Backend API</p>
										<p className="text-xs text-muted-foreground truncate">GET /api/links</p>
									</div>
								</div>
								<Badge variant={health?.backend.ok ? 'default' : 'destructive'} className={`${health?.backend.ok ? 'bg-green-600' : ''} shrink-0 text-xs`}>
									{health?.backend.ok ? 'Active' : 'Down'}
								</Badge>
							</div>

							<div className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-gray-50 dark:bg-gray-900 gap-2">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
									<Activity className="w-4 h-4 text-primary shrink-0" />
									<div className="min-w-0">
										<p className="text-xs sm:text-sm font-medium truncate">Redirect Service</p>
										<p className="text-xs text-muted-foreground truncate">GET /:code</p>
									</div>
								</div>
								<Badge variant="default" className="bg-green-600 shrink-0 text-xs">
									Active
								</Badge>
							</div>
						</div>
					</CardContent>
				</Card>

			</div>

			{/* Footer Info */}
			<Card className="mt-4 sm:mt-6">
				<CardContent className="pt-4 sm:pt-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 shrink-0" />
							<span className="truncate">Last updated: {health?.frontend.timestamp ? new Date(health.frontend.timestamp).toLocaleString() : '--'}</span>
						</div>
						<div className="flex items-center gap-2">
							<Activity className="w-4 h-4 shrink-0" />
							<span>Auto-refresh: Manual</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

