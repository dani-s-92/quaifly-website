import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './global.css';

export const metadata: Metadata = {
  title: '$FLY',
  description: 'QuaiFly is one of the first community-powered memecoins built on the innovative @QuaiNetwork...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}
