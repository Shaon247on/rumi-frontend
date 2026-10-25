import type { Metadata } from "next";
import type React from "react";
import "../../styles/globals.css";

import { DirectionProvider } from "@/components/ui/direction";
import { routing } from "@/i18n/routing";
import {
  amiri,
  cormorantGaramond,
  ibmPlexArabic,
  jost,
  lato,
  notoNaskhArabic,
} from "@/lib/fonts";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { RootWrapper } from "./root-wrapper";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "غلومي - العناية بالبشرة القائمة على العلم والذكاء الاصطناعي"
    : "GLOWMI - Science-Backed Skincare & AI Skin Intelligence";

  const description = isAr
    ? "اكتشف غلومي، العلامة التجارية السعودية الفاخرة للعناية بالبشرة. نقدم تحليلاً ذكياً للبشرة مدعوماً بالذكاء الاصطناعي وروتينات مخصصة مصممة علمياً لبشرتك."
    : "Discover GLOWMI, the premier Saudi luxury skincare brand focused on science-backed skin intelligence. Explore AI-powered skin analysis and personalized routines.";

  const keywords = isAr
    ? [
        "العناية بالبشرة",
        "تحليل البشرة بالذكاء الاصطناعي",
        "العناية الشخصية بالبشرة",
        "العناية الفاخرة بالبشرة",
        "روتين البشرة",
        "غلومي",
        "جمال",
        "مستحضرات التجميل",
        "المملكة العربية السعودية",
        "السعودية",
      ]
    : [
        "skincare",
        "AI skin analysis",
        "personalized skincare",
        "luxury skincare",
        "skin routine",
        "GLOWMI",
        "beauty",
        "cosmetics",
        "Saudi Arabia",
        "KSA",
        "science-backed skincare",
        "skin intelligence",
      ];

  return {
    title: {
      default: title,
      template: `%s | ${isAr ? "غلومي" : "GLOWMI"}`,
    },
    description,
    keywords,
    authors: [{ name: "GLOWMI" }],
    creator: "GLOWMI",
    openGraph: {
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_SA",
      url: `https://glowmi.com/${locale}`,
      title,
      description,
      siteName: "GLOWMI",
      images: [
        {
          url: "https://glowmi.com/images/og-image.png",
          width: 1200,
          height: 630,
          alt: isAr
            ? "غلومي - العناية الفاخرة بالبشرة"
            : "GLOWMI - Luxury Skincare",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@glowmi",
      images: ["https://glowmi.com/images/og-image.png"],
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
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    return notFound();
  }

  const messages = await getMessages();
  const timeZone = "Asia/Riyadh";
  const isRTL = locale === "ar";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GLOWMI",
    url: "https://glowmi.com",
    logo: "https://glowmi.com/placeholder-logo.png",
    description: isRTL
      ? "جلومي هي علامة تجارية سعودية فاخرة للعناية بالبشرة تركز على ذكاء البشرة المدعوم بالعلم والذكاء الاصطناعي."
      : "Glowmi is a Saudi luxury skincare brand focused on science-backed skin intelligence.",
    sameAs: ["https://www.instagram.com/glowmi", "https://twitter.com/glowmi"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
    },
  };

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      data-locale={locale}
      suppressHydrationWarning
    >
      <head />
      <body
        className={`${lato.variable} ${ibmPlexArabic.variable} ${notoNaskhArabic.variable} ${jost.variable} ${cormorantGaramond.variable} ${amiri.variable} ${lato.className} overflow-x-hidden `}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <RootWrapper locale={locale} messages={messages} timeZone={timeZone}>
          <DirectionProvider direction={isRTL ? "rtl" : "ltr"}>
            {children}
          </DirectionProvider>
        </RootWrapper>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
