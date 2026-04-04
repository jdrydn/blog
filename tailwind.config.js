/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './_posts/**/*.md',
    './_employment/**/*.html',
    './*.html',
    './pages/**/*.html',
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.75rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '2rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'var(--color-zinc-600)',
            '--tw-prose-headings': 'var(--color-zinc-900)',
            '--tw-prose-links': 'var(--color-teal-500)',
            '--tw-prose-bold': 'var(--color-zinc-900)',
            '--tw-prose-counters': 'var(--color-zinc-900)',
            '--tw-prose-bullets': 'var(--color-zinc-900)',
            '--tw-prose-hr': 'var(--color-zinc-100)',
            '--tw-prose-quote-borders': 'var(--color-zinc-200)',
            '--tw-prose-code': 'var(--color-zinc-700)',
            '--tw-prose-pre-code': 'var(--color-zinc-100)',
            '--tw-prose-pre-bg': 'var(--color-zinc-900)',
            a: {
              color: 'var(--color-teal-500)',
              fontWeight: '600',
              textDecoration: 'underline',
            },
            'a:hover': {
              color: 'var(--color-teal-600)',
            },
            img: {
              borderRadius: '0.5rem',
            },
            pre: {
              borderRadius: '1.5rem',
              padding: '2rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
