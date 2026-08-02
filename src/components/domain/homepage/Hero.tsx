import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/payload/queries";
import { getMawaqitData } from "@/lib/mawaqit/get-mawaqit-data";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("hero");
  const siteSettings = await getSiteSettings(locale);
  const mawaqit = await getMawaqitData(siteSettings.mawaqitSlug);
  const exteriorImage = mawaqit?.images.exterior;

  return (
    <section className="relative overflow-hidden bg-sage">
      <div className="absolute inset-0">
        {exteriorImage ? (
          <Image
            src={exteriorImage}
            alt="An-Nur Moschee — Außenansicht"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full">
            <PlaceholderImage label="ADD MOSQUE PHOTO — EXTERIOR" aspect="wide" className="h-full rounded-none" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-charcoal/10" />
      </div>

      <div className="relative mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col justify-end px-5 pb-14 pt-32 text-ivory sm:px-8 sm:pb-20">
        <p className="animate-fade-rise text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          {t("eyebrow")}
        </p>
        <h1 className="animate-fade-rise mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="animate-fade-rise mt-5 max-w-xl text-base text-ivory/90 sm:text-lg">{t("description")}</p>

        <div className="animate-fade-rise mt-8 flex flex-wrap gap-3">
          <Button href="/#gebetszeiten" variant="primary">
            {t("primaryCta")}
          </Button>
          <Button href="/unsere-moschee" variant="outline" className="border-ivory text-ivory hover:bg-ivory hover:text-mosque-green">
            {t("secondaryCta")}
          </Button>
          <Button href="/spenden" variant="secondary">
            {t("donateCta")}
          </Button>
          <Button href="/mitgliedschaft" variant="ghost" className="text-ivory hover:bg-ivory/10">
            {t("memberCta")}
          </Button>
        </div>
      </div>
    </section>
  );
}
