import { defineRouting } from "next-intl/routing";

export const locales = ["de", "en", "fa", "ps"] as const;
export type Locale = (typeof locales)[number];

export const rtlLocales: readonly Locale[] = ["fa", "ps"];

export const routing = defineRouting({
  locales,
  defaultLocale: "de",
  localePrefix: "always",
});

export const isRtl = (locale: string): boolean => (rtlLocales as readonly string[]).includes(locale);
