import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'CariVet - Find Veterinary Clinics in Malaysia',
    template: '%s | CariVet Malaysia',
  },
  description:
    'Find trusted veterinary clinics across Malaysia. CariVet helps pet owners locate the best veterinary care for their beloved animals.',
  keywords: [
    'veterinary clinics',
    'pet care',
    'animal hospital',
    'Malaysia',
    'veterinarian',
    'pet health',
    'emergency vet',
    'pet services',
  ],
  authors: [{ name: 'CariVet Malaysia' }],
  creator: 'CariVet Malaysia',
  publisher: 'CariVet Malaysia',
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: 'https://carivet.my',
    siteName: 'CariVet Malaysia',
    title: 'CariVet - Find Veterinary Clinics in Malaysia',
    description:
      'Find trusted veterinary clinics across Malaysia. CariVet helps pet owners locate the best veterinary care for their beloved animals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CariVet - Veterinary Directory Malaysia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CariVet - Find Veterinary Clinics in Malaysia',
    description:
      'Find trusted veterinary clinics across Malaysia. CariVet helps pet owners locate the best veterinary care for their beloved animals.',
    images: ['/og-image.png'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
