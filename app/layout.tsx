import type { Metadata } from 'next'
import { Figtree, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const figtree = Figtree({ 
  subsets: ["latin"],
  variable: '--font-figtree',
});

const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Souq Market - Your Trusted Marketplace',
  description: 'Buy and sell electronics, fashion, household goods and more on Souq Market',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${cairo.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
