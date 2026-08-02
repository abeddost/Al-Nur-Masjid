import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getActiveAnnouncement, getNavigationItems, getSiteSettings } from "@/lib/payload/queries";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CompactNextPrayer } from "@/components/layout/CompactNextPrayer";
import { Button } from "@/components/ui/Button";

export async function Header() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("common");
  const [navItems, announcement, siteSettings] = await Promise.all([
    getNavigationItems(locale),
    getActiveAnnouncement(locale),
    getSiteSettings(locale),
  ]);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <AnnouncementBar
        announcement={
          announcement
            ? {
                id: String(announcement.id),
                message: announcement.message,
                link: announcement.link,
                variant: announcement.variant,
              }
            : null
        }
      />
      <div className="border-b border-mosque-green/10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-mosque-green-dark">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gold/60 text-[10px] font-semibold uppercase text-gold"
            >
              Logo
            </span>
            An-Nur
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-mosque-green-dark hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CompactNextPrayer mawaqitSlug={siteSettings.mawaqitSlug} />
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Button href="/spenden" variant="secondary" className="hidden sm:inline-flex">
              {t("donateNow")}
            </Button>
            <MobileMenu items={navItems} />
          </div>
        </div>
      </div>
    </header>
  );
}
