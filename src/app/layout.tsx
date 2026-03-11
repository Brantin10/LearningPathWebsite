import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: { default: 'My Future Career', template: '%s | My Future Career' },
  description: 'AI-powered career guidance platform - Find your perfect career path, build skills, and land your dream job',
  icons: { icon: '/logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'My Future Career',
    title: 'My Future Career',
    description: 'AI-powered career guidance platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Future Career',
    description: 'AI-powered career guidance platform',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
