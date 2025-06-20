"use client";
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './global.css';
import Menu from './components/Menu';
import { ReactLenis } from './utils/lenis';
import Footer from './components/Footer';
import { usePathname } from 'next/navigation'; // ✅ okay here

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: '$FLY',
  description:
    'QuaiFly is one of the first community-powered memecoins built on the innovative @QuaiNetwork — fueled by good vibes, swarm energy, and a shared belief in a decentralized future.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {

  const pathname = usePathname(); // ✅ this is the right spot

  return (
    <html lang="en" className="scroll-smooth">
      <ReactLenis root>
        <body className={`${plusJakarta.className} antialiased overflow-x-hidden`}>
          {!pathname.startsWith('/blackjack') && <Menu />}
          {children}
          {!pathname.startsWith('/blackjack') && <Footer />}
        </body>
      </ReactLenis>
    </html>
  );
}
