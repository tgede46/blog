import type { Metadata } from "next"
import { Geist, Geist_Mono, Merriweather } from "next/font/google"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "../globals.css"
import { AuthProvider } from "@/lib/auth"
import QueryProvider from "@/components/QueryProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const messages = await getMessages({ locale })
  const metadata = messages.Metadata as Record<string, string>

  const localeConfig: Record<string, { og: string }> = {
    fr: { og: "fr_FR" },
    en: { og: "en_US" },
    es: { og: "es_ES" },
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: metadata.homeTitle, template: metadata.homeTitleTemplate },
    description: metadata.homeDescription,
    keywords: ["Gedeon Kpara", "blog", "développement", "architecture logicielle", "TypeScript", "Node.js", "React", "Next.js", "Python", " FastAPI"],
    openGraph: {
      type: "website",
      locale: localeConfig[locale]?.og || "fr_FR",
      siteName: "Gedeon Kpara",
      title: metadata.homeTitle,
      description: metadata.homeDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.homeTitle,
      description: metadata.homeDescription,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    alternates: { types: { "application/rss+xml": "/feed.xml" } },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${merriweather.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-white focus:px-4 focus:py-2">Aller au contenu</a>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
