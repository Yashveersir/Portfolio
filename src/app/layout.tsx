import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from "@vercel/analytics/next";

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yashveer Singh | Full-Stack & AI Engineer',
  description: 'Portfolio of Yashveer Singh — Full-Stack Developer specializing in MERN stack, Generative AI, and secure backend systems. Open to work.',
  keywords: ['Yashveer Singh', 'Full-Stack Developer', 'MERN Stack', 'Generative AI', 'Portfolio', 'React', 'Node.js', 'Backend Engineer', 'Web Developer India'],
  authors: [{ name: 'Yashveer Singh' }],
  creator: 'Yashveer Singh',
  metadataBase: new URL('https://yashveersingh.xyz'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yashveersingh.xyz',
    siteName: 'Yashveer Singh Portfolio',
    title: 'Yashveer Singh | Full-Stack & AI Engineer',
    description: 'Full-Stack Developer specializing in MERN stack, Generative AI, and secure backend systems. Currently open to new opportunities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yashveer Singh — Full-Stack & AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashveer Singh | Full-Stack & AI Engineer',
    description: 'Full-Stack Developer specializing in MERN stack, Generative AI, and secure backend systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className={`${dmSans.className} bg-black text-white antialiased min-h-screen selection:bg-cyan-500/30`}>
        <CustomCursor />
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
