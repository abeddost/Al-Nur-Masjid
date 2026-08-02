import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { PRAYER_NAMES, addMinutes } from "@/lib/mawaqit/get-mawaqit-data";
import { getNextPrayerInfo, type NextPrayerInfo } from "@/lib/mawaqit/get-next-prayer-info";
import { getSiteSettings } from "@/lib/payload/queries";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function hijriDate(locale: string, hijriAdjustmentDays: number): string {
  const adjusted = new Date();
  adjusted.setDate(adjusted.getDate() + hijriAdjustmentDays);
  try {
    return new Intl.DateTimeFormat(`${locale}-u-ca-islamic`, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(adjusted);
  } catch {
    return new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(adjusted);
  }
}

export async function PrayerTimesSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("prayerTimes");
  const siteSettings = await getSiteSettings(locale);
  const info = await getNextPrayerInfo(siteSettings.mawaqitSlug);
  const mawaqitUrl = `https://mawaqit.net/en/${siteSettings.mawaqitSlug}`;

  const gregorianDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <section id="gebetszeiten" className="relative overflow-hidden bg-mosque-green py-16 text-ivory sm:py-24">
      <div className="pattern-geometric absolute inset-0 opacity-[0.08]" aria-hidden="true" />
      <Container className="relative">
        <Reveal>
          <SectionHeading
            eyebrow={t("subheading")}
            heading={t("heading")}
            tone="light"
            subheading={`${gregorianDate} · ${info ? hijriDate(locale, info.data.hijriAdjustment) : t("hijriLoading")}`}
          />
        </Reveal>

        {info ? (
          <div className="mt-10">
            <PrayerTimesGrid info={info} />
          </div>
        ) : (
          <Reveal>
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl bg-ivory/10 p-8 text-center">
              <p>{t("unavailable")}</p>
              <a
                href={mawaqitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-charcoal"
              >
                {t("openMawaqit")} <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

async function PrayerTimesGrid({ info }: { info: NextPrayerInfo }) {
  const t = await getTranslations("prayerTimes");
  const { data, next } = info;

  const rows = [
    { key: "fajr", label: t("fajr"), time: data.times[0], iqama: addMinutes(data.times[0], data.iqamaOffsets[0]) },
    { key: "sunrise", label: t("sunrise"), time: data.shuruq, iqama: null },
    { key: "dhuhr", label: t("dhuhr"), time: data.times[1], iqama: addMinutes(data.times[1], data.iqamaOffsets[1]) },
    { key: "asr", label: t("asr"), time: data.times[2], iqama: addMinutes(data.times[2], data.iqamaOffsets[2]) },
    { key: "maghrib", label: t("maghrib"), time: data.times[3], iqama: addMinutes(data.times[3], data.iqamaOffsets[3]) },
    { key: "isha", label: t("isha"), time: data.times[4], iqama: addMinutes(data.times[4], data.iqamaOffsets[4]) },
  ] satisfies { key: (typeof PRAYER_NAMES)[number] | "sunrise"; label: string; time: string; iqama: string | null }[];

  return (
    <div>
      <Reveal>
        <p className="mb-8 text-center text-sm font-medium text-ivory/75">
          {t("nextPrayer")}:{" "}
          <span className="font-semibold text-gold">
            {next.name === "jumua" ? t("jumuah") : t(next.name as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha")}
          </span>
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {rows.map((row) => (
            <div
              key={row.key}
              className={`rounded-2xl p-4 text-center transition-colors ${
                row.key === next.name || (row.key === "dhuhr" && next.name === "jumua")
                  ? "bg-gold text-charcoal"
                  : "bg-ivory/10"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{row.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums">{row.time}</p>
              {row.iqama && row.iqama !== row.time && (
                <p className="mt-1 text-[11px] opacity-70">
                  {t("iqama")}: {row.iqama}
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {data.jumua && (
        <Reveal delay={0.3}>
          <p className="mt-6 text-center text-sm text-ivory/85">
            {t("jumuah")}: <span className="font-semibold">{data.jumua}</span>
          </p>
        </Reveal>
      )}
    </div>
  );
}
