import clsx from "clsx/lite"
import type { ReactNode } from "react"

const variantStyles = {
  primary: 'border-zinc-160 bg-zinc-800 font-semibold text-zinc-100',
  secondary: 'border-zinc-10 bg-zinc-50 font-medium text-zinc-900',
  gray: 'border-gray-200 bg-gray-100/50 text-gray-800',
  red: 'border-red-200 bg-red-100/50 text-red-800',
  yellow: 'border-yellow-200 bg-yellow-100/50 text-yellow-800',
  orange: 'border-orange-200 bg-orange-100/50 text-orange-800',
  amber: 'border-amber-200 bg-amber-100/50 text-amber-800',
  green: 'border-green-200 bg-green-100/50 text-green-800',
  blue: 'border-blue-200 bg-blue-100/50 text-blue-800',
  purple: 'border-purple-200 bg-purple-100/50 text-purple-800',
}

export function Badge({
  variant,
  children,
}: {
  variant?: keyof typeof variantStyles
  children: ReactNode | undefined
}) {
  const className = clsx(
    'inline-flex items-center space-x-2.5 border rounded-full px-3 py-1 text-sm',
    variant ? variantStyles[variant] : variantStyles.gray,
  )
  return (
    <span className={className}>
      {children}
    </span>
  )
}
