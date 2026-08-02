import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFooterSettings, getNavigationItems, getSiteSettings } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("footer");
  const [navItems, siteSettings, footerSettings] = await Promise.all([
    getNavigationItems(locale),
    getSiteSettings(locale),
    getFooterSettings(locale),
  ]);

  return (
    <footer className="mt-24 border-t border-mosque-green/15 bg-mosque-green-dark text-ivory">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">An-Nur Moschee</p>
          <p className="mt-2 text-sm text-ivory/75">
            {footerSettings.shortDescription || siteSettings.legalName}
          </p>
          <Link
            href="/#gebetszeiten"
            className="mt-4 inline-block rounded-full bg-gold px-4 py-2 text-xs font-semibold text-charcoal"
          >
            {t("prayerTimes")}
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">{t("navigation")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory/85">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">{t("contact")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory/85">
            <li>{siteSettings.address}</li>
            <li>
              <a href={`mailto:${siteSettings.email}`} className="hover:text-gold">
                {siteSettings.email}
              </a>
            </li>
            {(siteSettings.phoneNumbers ?? []).map((p) => (
              <li key={p.number}>
                <a href={`tel:${p.number.replace(/\s+/g, "")}`} className="hover:text-gold">
                  {p.number}
                </a>{" "}
                <span className="text-xs text-ivory/60">({p.label})</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">{t("legal")}</p>
          <ul className="mt-3 space-y-2 text-sm text-ivory/85">
            <li>
              <Link href="/impressum" className="hover:text-gold">
                {t("impressum")}
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-gold">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <button type="button" className="text-start hover:text-gold">
                {t("cookieSettings")}
              </button>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-ivory/10 py-5 text-center text-xs text-ivory/60">
        © {new Date().getFullYear()} {siteSettings.legalName}
      </div>
    </footer>
  );
}
