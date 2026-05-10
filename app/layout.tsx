import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: {
    default: "TechChampTools",
    template: "%s | TechChampTools",
  },
  description:
    "Improve your productivity with pro tools.",
  keywords: [
    "online store",
    "quality products",
    "pro tools",
    "premium tools",
    "WhatsApp ordering",
  ],
  authors: [{ name: "TechChampTools" }],
  creator: "TechChampTools",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "TechChampTools",
    title: "TechChampTools",
    description:
      "Improve your productivity with pro tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechChampTools",
    description:
      "Improve your productivity with pro tools.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3f0" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1816" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
