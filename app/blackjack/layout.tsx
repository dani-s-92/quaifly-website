import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Welcome to QuaiFly!',
  description: 'Welcome to QuaiFly!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
        // Suppress hydration warnings for the body as a fallback
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}