"use client";

import { usePathname } from 'next/navigation';
import Menu from './components/Menu';
import Footer from './components/Footer';
import { ReactLenis } from './utils/lenis';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ReactLenis root>
      <body className={`${plusJakarta.className} antialiased overflow-x-hidden`}>
        {!pathname.startsWith('/blackjack') && <Menu />}
        {children}
        {!pathname.startsWith('/blackjack') && <Footer />}
      </body>
    </ReactLenis>
  );
}
