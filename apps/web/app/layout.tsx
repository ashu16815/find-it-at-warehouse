import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

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
      </body>
    </html>
  )
}
