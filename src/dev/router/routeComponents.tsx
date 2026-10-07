import React, { Suspense } from 'react'

// 加载占位
export const LoadingFallback = () => (
	<div className="flex items-center justify-center min-h-[60vh]">
		<div className="flex gap-2">
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
			<div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
		</div>
	</div>
)

// 懒加载包装
export const Lazy = ({ children }: { children: React.ReactNode }) => (
	<Suspense fallback={<LoadingFallback />}>
		{children}
	</Suspense>
)
