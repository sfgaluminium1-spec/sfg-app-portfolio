
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TransparentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassLevel?: 'none' | 'light' | 'medium' | 'heavy'
  children: React.ReactNode
}

const glassStyles = {
  none: '',
  light: 'bg-white/5 backdrop-blur-sm',
  medium: 'bg-white/10 backdrop-blur-md',
  heavy: 'bg-white/20 backdrop-blur-lg',
}

export function TransparentCard({ 
  children, 
  className, 
  glassLevel = 'medium',
  ...props 
}: TransparentCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-white/10 shadow-xl',
        glassStyles[glassLevel],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TransparentCardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function TransparentCardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-2xl font-semibold leading-none tracking-tight text-white', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function TransparentCardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-white/70', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function TransparentCardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}

export function TransparentCardFooter({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}
