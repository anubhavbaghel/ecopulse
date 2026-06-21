import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/layout/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EcoPulse — Your Personal Climate Companion',
  description:
    'Track your carbon footprint, build sustainable habits, and get AI-powered suggestions to reduce your environmental impact — beautifully.',
  keywords: ['carbon footprint', 'sustainability', 'climate', 'habits', 'eco'],
  openGraph: {
    title: 'EcoPulse',
    description: 'Your personal climate companion',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
