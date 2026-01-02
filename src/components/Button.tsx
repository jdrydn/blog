import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary: 'bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70',
  secondary: 'bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
  align?: 'start' | 'center' | 'end',
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  align = 'center',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    `inline-flex items-center gap-2 justify-${align} rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none`,
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}