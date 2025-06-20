import type { Metadata } from 'next';
import './global.css';
import ClientLayout from './ClientLayout'; // 👈 we'll create this next

export const metadata: Metadata = {
  title: '$FLY',
  description:
    'QuaiFly is one of the first community-powered memecoins built on the innovative @QuaiNetwork — fueled by good vibes, swarm energy, and a shared belief in a decentralized future.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}
