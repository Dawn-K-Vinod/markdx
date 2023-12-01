import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

import "@/styles/globals.css"
import "@/styles/components.css"
import { Metadata } from "next"

import { fontHeading, fontMono, fontSans } from "@/lib/fonts"
import Providers from "@/components/providers"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "Markdown",
    "MDX",
    "Markdown editor",
    "MDX editor",
    "Markdown preview",
    "MDX preview",
    "AI Markdown",
    "AI MDX",
    "AI Markdown editor",
    "AI MDX editor",
    "MarkDX editor",
    "MarkDX",
  ],
  authors: [
    {
      name: siteConfig.creator.name,
      url: siteConfig.creator.website,
    },
  ],
  creator: siteConfig.creator.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.creator.twitterId,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontMono.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
