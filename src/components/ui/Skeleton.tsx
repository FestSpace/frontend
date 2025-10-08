import React from 'react'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', children }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
      {children}
    </div>
  )
}

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
  )
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card p-4 animate-pulse">
      <Skeleton className="h-48 rounded-lg mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  )
}