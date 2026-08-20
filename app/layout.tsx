import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/next'
import { SmoothScrollProvider } from '@/components/providers/smooth-scroll-provider'
import './globals.css'

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const morton = localFont({
  src: [
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Thin.otf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-ExtraLight.otf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-ExtraBold.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/morton/Morton_EnvatoElements/OTF/Morton-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-morton',
  display: 'swap',
})

const frygia = localFont({
  src: [
    {
      path: '../public/fonts/frygia/Frygia-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-XLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/frygia/Frygia-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-frygia',
  display: 'swap',
})

const cartoonist = localFont({
  src: [
    {
      path: '../public/cartoonist/CartoonistJNL.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/cartoonist/CartoonistJNL.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/cartoonist/CartoonistJNL.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-cartoonist',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://rewindstatic.com'),
  title: 'Rewind Static | $RWD — 90s Saturday Morning Cartoons on Solana',
  description: 'The Saturday morning cartoon experience reborn on Solana. No VC bags, no presale — just 90s nostalgia, Rewind Climber pixel platformer, and VHS vibes.',
  keywords: [
    'Rewind Static',
    '$RWD',
    'RWD token',
    'Solana memecoin',
    '90s cartoons',
    'VHS static',
    'Rewind Climber',
    'Retro gaming',
    'Solana crypto',
    'Fair launch',
  ],
  authors: [{ name: 'Rewind Static Team' }],
  creator: '@RewindStatic78',
  publisher: 'Rewind Static',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/rewind-logo.png', sizes: 'any' },
      { url: '/rewind-logo.png', type: 'image/png' },
    ],
    shortcut: '/rewind-logo.png',
    apple: [
      { url: '/rewind-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Rewind Static | $RWD — The Good Old Days',
    description: 'Turn on the TV, grab a bowl of cereal, and hop into the rerun. 90s Saturday morning cartoons on Solana with live browser gaming and fair launch pledge.',
    url: 'https://rewindstatic.com',
    siteName: 'Rewind Static',
    images: [
      {
        url: '/hero-bg.png',
        width: 1920,
        height: 1080,
        alt: 'Rewind Static $RWD Hero Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rewind Static | $RWD — The Good Old Days on Solana',
    description: 'The Saturday morning cartoon experience reborn on Solana. No VC bags, no presale, just vibes and a chart.',
    site: '@RewindStatic78',
    creator: '@RewindStatic78',
    images: ['/hero-bg.png'],
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${morton.variable} ${frygia.variable} ${cartoonist.variable} ${geistMono.variable} font-sans bg-black text-zinc-100 antialiased selection:bg-fuchsia-600 selection:text-white min-h-screen`}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  )
}
