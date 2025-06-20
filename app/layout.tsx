"use client";
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './global.css'
import Menu from './components/Menu'
import { ReactLenis } from './utils/lenis'
import Footer from './components/Footer'
import { usePathname } from 'next/navigation'; // 👈 Add this too

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: '$FLY',
  description:
    'QuaiFly is one of the first community-powered memecoins built on the innovative @QuaiNetwork — fueled by good vibes, swarm energy, and a shared belief in a decentralized future.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  return (
    <html lang="en" className="scroll-smooth">
      <ReactLenis root>
        <body className={`${plusJakarta.className} antialiased overflow-x-hidden`}>
          {!pathname.startsWith('/blackjack') && <Menu />}
          {!pathname.startsWith('/blackjack') && <Footer />}
          {children}
          <Footer />
        </body>
      </ReactLenis>
    </html>
  )
}
/*
<body
          className={`${plusJakarta.className} antialiased overflow-x-hidden`}
        >
          <Menu />
          {children}
          <Footer />
        </body>
*/