import { getLocale, getTranslations } from "next-intl/server";
import { BookOpen } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getQuranClasses } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export async function QuranSchoolTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("quranSchool");
  const classes = await getQuranClasses(locale);

  return (
    <section className="bg-sage/50 py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <BookOpen className="h-10 w-10 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold text-mosque-green-dark sm:text-4xl">{t("heading")}</h2>
            <p className="mt-2 text-charcoal/70">{t("subheading")}</p>
            <Button href="/koranschule" variant="primary" className="mt-6">
              {t("registerCta")}
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map((c) => (
                <div key={c.id} className="rounded-2xl bg-white p-5 shadow-sm">
                  <p className="font-semibold text-mosque-green-dark">{c.label}</p>
                  <p className="mt-1 text-sm text-charcoal/70">
                    {(c.dayOfWeek ?? []).join(", ")}
                    {c.startTime && c.endTime ? ` · ${c.startTime}–${c.endTime}` : ""}
                    {c.relativeTiming ? ` · ${c.relativeTiming}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
