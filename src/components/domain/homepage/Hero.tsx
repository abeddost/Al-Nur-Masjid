import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Clock } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/payload/queries";
import { getNextPrayerInfo } from "@/lib/mawaqit/get-next-prayer-info";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Countdown } from "@/components/domain/prayer-times/Countdown";

export async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("hero");
  const tPrayer = await getTranslations("prayerTimes");
  const siteSettings = await getSiteSettings(locale);
  const info = await getNextPrayerInfo(siteSettings.mawaqitSlug);
  const exteriorImage = info?.data.images.exterior;

  return (
    <section className="relative overflow-hidden bg-mosque-green-dark">
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
        {/* Overall image dim, plus a stronger scrim behind the text panel below so contrast never depends on the photo. */}
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/10" />
      </div>

      <div className="relative mx-auto flex min-h-[560px] w-full max-w-6xl flex-col justify-end gap-4 px-4 pb-8 pt-24 sm:min-h-[70vh] sm:gap-6 sm:px-8 sm:pb-14 sm:pt-32 lg:min-h-[75vh] lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:pb-16 lg:pt-36">
        <div className="animate-fade-rise order-2 max-w-2xl rounded-2xl bg-mosque-green-dark/85 p-5 text-ivory shadow-2xl backdrop-blur-sm sm:rounded-3xl sm:p-7 lg:order-1 lg:p-9">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold sm:text-xs sm:tracking-[0.25em]">
            {t("eyebrow")}
          </p>
          <h1 className="font-display mt-2.5 text-3xl font-semibold leading-[1.1] sm:mt-3 sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-3.5 max-w-xl text-sm text-ivory/90 sm:mt-5 sm:text-lg">{t("description")}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <Button href="/#gebetszeiten" variant="primary" className="text-xs sm:text-sm">
              {t("primaryCta")}
            </Button>
            <Button
              href="/unsere-moschee"
              variant="outline"
              className="border-ivory text-xs text-ivory hover:bg-ivory hover:text-mosque-green sm:text-sm"
            >
              {t("secondaryCta")}
            </Button>
            <Button href="/spenden" variant="secondary" className="text-xs sm:text-sm">
              {t("donateCta")}
            </Button>
            <Button href="/mitgliedschaft" variant="ghost" className="text-xs text-ivory hover:bg-ivory/10 sm:text-sm">
              {t("memberCta")}
            </Button>
          </div>
        </div>

        <div className="animate-fade-rise order-1 w-full shrink-0 self-stretch rounded-2xl bg-ivory p-4 text-center text-mosque-green-dark shadow-2xl sm:rounded-3xl sm:p-6 lg:order-2 lg:max-w-xs lg:self-end">
          {info ? (
            <>
              <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {tPrayer("nextPrayer")}
              </p>
              <p className="font-display mt-1 text-xl font-semibold">
                {info.next.name === "jumua"
                  ? tPrayer("jumuah")
                  : tPrayer(info.next.name as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha")}
              </p>
              <div className="mt-2">
                <Countdown initialSecondsRemaining={info.initialSecondsRemaining} />
              </div>
              <a
                href="#gebetszeiten"
                className="mt-3 inline-block text-xs font-semibold text-mosque-green underline-offset-4 hover:underline sm:mt-4"
              >
                {tPrayer("heading")} →
              </a>
            </>
          ) : (
            <p className="text-sm text-mosque-green-dark/70">{tPrayer("unavailable")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
