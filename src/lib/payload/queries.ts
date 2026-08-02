import { getPayload } from "@/lib/payload/getPayload";
import type { Locale } from "@/i18n/routing";

export async function getNavigationItems(locale: Locale) {
  const payload = await getPayload();
  const nav = await payload.findGlobal({ slug: "navigation", locale, fallbackLocale: "de" });
  return (nav.items ?? []).map((item) => ({ label: item.label, href: item.href }));
}

export async function getSiteSettings(locale: Locale) {
  const payload = await getPayload();
  return payload.findGlobal({ slug: "site-settings", locale, fallbackLocale: "de" });
}

export async function getFooterSettings(locale: Locale) {
  const payload = await getPayload();
  return payload.findGlobal({ slug: "footer", locale, fallbackLocale: "de" });
}

export async function getActiveAnnouncement(locale: Locale) {
  const payload = await getPayload();
  const now = new Date().toISOString();
  const result = await payload.find({
    collection: "announcements",
    locale,
    fallbackLocale: "de",
    where: {
      and: [
        { isActive: { equals: true } },
        { startDate: { less_than_equal: now } },
        {
          or: [{ endDate: { greater_than_equal: now } }, { endDate: { exists: false } }],
        },
      ],
    },
    sort: "-priority",
    limit: 1,
  });
  return result.docs[0] ?? null;
}

export async function getServices(locale: Locale) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "services",
    locale,
    fallbackLocale: "de",
    sort: "order",
    limit: 12,
  });
  return result.docs;
}

export async function getActiveDonationCampaign(locale: Locale) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "donation-campaigns",
    locale,
    fallbackLocale: "de",
    where: { isActive: { equals: true } },
    limit: 1,
  });
  return result.docs[0] ?? null;
}

export async function getLatestNews(locale: Locale, limit = 3) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "news",
    locale,
    fallbackLocale: "de",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit,
  });
  return result.docs;
}

export async function getQuranClasses(locale: Locale) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "quran-classes",
    locale,
    fallbackLocale: "de",
    sort: "order",
    limit: 20,
  });
  return result.docs;
}
