import { getLocale, getTranslations } from "next-intl/server";
import { BookOpen } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getQuranClasses } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const WEEKDAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export async function QuranSchoolTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("quranSchool");
  const tWeekday = await getTranslations("weekday");
  const classes = await getQuranClasses(locale);

  return (
    <section className="bg-sage/50 py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gold ring-4 ring-gold/15">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="font-display mt-5 text-3xl font-semibold leading-tight text-mosque-green-dark sm:text-4xl">
              {t("heading")}
            </h2>
            <span aria-hidden="true" className="mt-4 block h-[3px] w-14 rounded-full bg-gold" />
            <p className="mt-4 text-charcoal/70">{t("subheading")}</p>
            <Button href="/koranschule" variant="primary" className="mt-6">
              {t("registerCta")}
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map((c) => {
                const days = WEEKDAY_ORDER.filter((d) => c.dayOfWeek?.includes(d)).map((d) => tWeekday(d));
                return (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-mosque-green/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <p className="font-display font-semibold text-mosque-green-dark">{c.label}</p>
                    <p className="mt-1.5 text-sm text-charcoal/70">
                      {days.join(", ")}
                      {c.startTime && c.endTime ? ` · ${c.startTime}–${c.endTime}` : ""}
                      {c.relativeTiming ? ` · ${c.relativeTiming}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
