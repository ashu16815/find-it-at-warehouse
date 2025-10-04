import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  title: 'Find it @ Warehouse',
  description: 'AI-first shopping meta-search that prioritises The Warehouse Group brands',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
