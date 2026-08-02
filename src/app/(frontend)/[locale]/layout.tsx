import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Fraunces, Manrope, Vazirmatn } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { routing, isRtl } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "../../globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "An-Nur Moschee Wiesbaden",
  description:
    "An-Nur Moschee – Afghanisch Islamischer Kulturverein Wiesbaden und Umgebung e.V. Gebetszeiten, Koranschule, Gemeinschaft und mehr.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const dir = isRtl(locale) ? "rtl" : "ltr";
  const fontVariables = isRtl(locale)
    ? vazirmatn.variable
    : `${manrope.variable} ${fraunces.variable}`;

  return (
    <html lang={locale} dir={dir} className={fontVariables}>
      <body
        className="flex min-h-screen flex-col font-sans antialiased"
        style={
          {
            "--font-body": isRtl(locale) ? "var(--font-vazirmatn)" : "var(--font-manrope)",
            // Persian/Pashto headings use a heavier Vazirmatn weight rather than a separate
            // display face — a dedicated calligraphic font is reserved for short decorative
            // accents only, never for full headings/body text.
            "--font-display": isRtl(locale) ? "var(--font-vazirmatn)" : "var(--font-fraunces)",
          } as React.CSSProperties
        }
      >
        <NextIntlClientProvider>
          <MotionConfig reducedMotion="user">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-mosque-green focus:px-4 focus:py-2 focus:text-ivory"
            >
              Skip to content
            </a>
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const dynamicParams = false;
