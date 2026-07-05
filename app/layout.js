import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  title: 'ShaswatHub — Dev Console | Building, Shipping, Breaking',
  description: 'Personal dev console of Shaswat — a live index of projects, desktop apps, and web tools. Built with Next.js, React Three Fiber, Three.js, GSAP and Spline.',
  keywords: ['developer', 'portfolio', 'Next.js', 'Three.js', 'React', 'GSAP', 'Spline', 'webGL'],
  authors: [{ name: 'Srijan Shaswat' }],
  openGraph: {
    title: 'ShaswatHub — Dev Console',
    description: 'A live index of projects, repos, and experiments — from desktop apps to web tools.',
    type: 'website',
    url: 'https://shaswathub.xyz',
    siteName: 'ShaswatHub',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShaswatHub — Dev Console',
    description: 'A live index of projects, repos, and experiments — from desktop apps to web tools.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <meta name="theme-color" content="#030303" />
      </head>
      <body className="font-body bg-[#030303] text-[#e8edf8] selection:bg-[#00f0ff]/20 selection:text-[#e8edf8] antialiased">
        {children}
      </body>
    </html>
  );
}
