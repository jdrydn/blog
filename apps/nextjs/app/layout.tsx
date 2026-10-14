import type { ReactNode } from 'react';

export const metadata = {
  title: 'Hello from Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'grid',
          placeItems: 'center',
          minHeight: '100vh',
          margin: 0,
          background: '#f6f7f9',
          color: '#1f2328',
        }}
      >
        {children}
      </body>
    </html>
  );
}
