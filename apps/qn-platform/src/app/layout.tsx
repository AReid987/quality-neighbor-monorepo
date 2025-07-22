import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "@/lib/auth-context-simple";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Quality Neighbor - Your Local Community Platform',
  description: 'Connect with your neighbors, discover local businesses, and build stronger communities.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-inter`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}