import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import type { Language } from '@/lib/content'
import type { Metadata } from 'next'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import { type Locale } from '@/i18n/routing'
import HomePageClient from './HomePageClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

const HOME_VIDEO = {
  videoId: '87bzUaPaamQ',
  title: 'Farever | Early Access | OUT NOW!',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farever.org'
  const pageUrl = locale === 'en' ? siteUrl : `${siteUrl}/${locale}`
  const title = 'Farever - Guide, Classes, Dungeons & Roadmap'
  const description =
    'Explore Farever guides for classes, builds, dungeons, crafting, roadmap, system requirements, multiplayer tips, and Early Access updates on Steam.'
  const heroImage = `${siteUrl}/images/hero.webp`

  return {
    title,
    description,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      title,
      description,
      url: pageUrl,
      siteName: 'Farever',
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'Farever - Online Co-op Action RPG',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farever.org'

  // 服务器端获取最新文章数据
  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Farever",
    "url": siteUrl,
    "logo": `${siteUrl}/android-chrome-512x512.png`,
    "image": `${siteUrl}/images/hero.webp`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <HomePageClient
        latestArticles={latestArticles}
        moduleLinkMap={moduleLinkMap}
        locale={locale}
        homeVideo={HOME_VIDEO}
      />
    </>
  )
}
