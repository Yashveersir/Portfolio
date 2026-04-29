import type { Metadata } from 'next';
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageLoader from '@/components/PageLoader';
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
  title: 'Yashveer Singh | Full-Stack & AI Engineer Portfolio',
  description: 'Explore the portfolio of Yashveer Singh, a Full-Stack Developer specializing in MERN stack, Generative AI, and secure backend systems. Based in Burdwan, West Bengal, India.',
  keywords: ['Yashveer Singh', 'Yashveer Singh Portfolio', 'Full-Stack Developer', 'MERN Stack Developer India', 'AI Engineer', 'Generative AI Specialist', 'Burdwan Developer', 'Next.js Developer'],
  authors: [{ name: 'Yashveer Singh' }],
  creator: 'Yashveer Singh',
  metadataBase: new URL('https://yashveersingh.xyz'),
  alternates: {
    canonical: 'https://yashveersingh.xyz',
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'rP5SFGFWNd2zFjbNfD3Qn7j5WojzWlr--Jo0OdttDzc',
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
    <html lang="en" className={`scroll-smooth ${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className={`${dmSans.className} antialiased min-h-screen selection:bg-[var(--cyan)]/30`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Yashveer Singh",
              "url": "https://yashveersingh.xyz",
              "jobTitle": "Full-Stack & AI Engineer",
              "image": {
                "@type": "ImageObject",
                "url": "https://yashveersingh.xyz/myImage.jpeg",
                "name": "Yashveer Singh"
              },
              "description": "Full-Stack Developer specializing in MERN stack, Generative AI, and secure backend systems.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Burdwan",
                "addressRegion": "West Bengal",
                "addressCountry": "India"
              },
              "sameAs": [
                "https://github.com/Yashveersir",
                "https://www.linkedin.com/in/yashveer-singh-41bb36280"
              ],
              "knowsAbout": [
                "Full-Stack Development",
                "MERN Stack",
                "Generative AI",
                "Backend Systems",
                "React",
                "Node.js",
                "JavaScript",
                "TypeScript"
              ]
            })
          }}
        />
        <div className="noise-overlay" />
        <PageLoader />
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
