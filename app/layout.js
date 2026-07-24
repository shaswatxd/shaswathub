import { JetBrains_Mono } from 'next/font/google';
import './globals.css';
import VisitorTracker from './components/VisitorTracker';

// General Sans isn't on Google Fonts — loaded via Fontshare's CDN <link> below.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://shaswathub.xyz'),
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
    images: [{ url: '/avatar.png', width: 512, height: 512, alt: 'ShaswatHub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShaswatHub — Dev Console',
    description: 'A live index of projects, repos, and experiments — from desktop apps to web tools.',
    images: ['/avatar.png'],
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
  icons: {
    icon: [{ url: '/favicon.svg?v=5', type: 'image/svg+xml' }],
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Srijan Shaswat',
    alternateName: 'ShaswatHub',
    url: 'https://shaswathub.xyz',
    image: 'https://shaswathub.xyz/avatar.png',
    jobTitle: 'Full-Stack & Desktop Developer',
    sameAs: ['https://github.com/shaswatxd'],
    knowsAbout: ['React', 'Next.js', 'Electron', 'Three.js', 'Node.js', 'WebRTC'],
  },
};

// Runs before paint (blocking, inline) so the correct theme applies before first render —
// prevents a flash of the wrong theme on load. Reads localStorage first, falls back to OS preference.
const themeInitScript = `
(function () {
  try {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-[#0a0a0a] text-[#f2f2f2] selection:bg-cyan-900 selection:text-[#f2f2f2] antialiased transition-colors duration-300">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
