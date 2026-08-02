import { getLocale, getTranslations } from "next-intl/server";
import { Accessibility, Baby, Car, Droplets, Users } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings } from "@/lib/payload/queries";
import { getMawaqitData } from "@/lib/mawaqit/get-mawaqit-data";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ClickToLoadMap } from "@/components/domain/homepage/ClickToLoadMap";

export async function VisitUsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("visit");
  const siteSettings = await getSiteSettings(locale);
  const mawaqit = await getMawaqitData(siteSettings.mawaqitSlug);

  const facilityRows = mawaqit
    ? [
        { icon: Users, active: mawaqit.facilities.womenSpace, label: t("womensArea") },
        { icon: Droplets, active: mawaqit.facilities.ablutions, label: "Wudu" },
        { icon: Car, active: mawaqit.facilities.parking, label: t("parking") },
        { icon: Accessibility, active: mawaqit.facilities.handicapAccessibility, label: t("accessibility") },
        { icon: Baby, active: mawaqit.facilities.childrenCourses, label: "Kinderkurse" },
      ]
    : [];

  return (
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <h2 className="text-3xl font-bold text-mosque-green-dark sm:text-4xl">{t("heading")}</h2>
          <dl className="mt-6 space-y-3 text-sm text-charcoal/80">
            <div>
              <dt className="font-semibold text-mosque-green-dark">{t("address")}</dt>
              <dd>{siteSettings.address}</dd>
            </div>
          </dl>

          {facilityRows.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facilityRows.map((row) => (
                <li
                  key={row.label}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium ${
                    row.active ? "bg-sage text-mosque-green-dark" : "bg-charcoal/5 text-charcoal/40 line-through"
                  }`}
                >
                  <row.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {row.label}
                </li>
              ))}
            </ul>
          )}

          <Button
            href={`https://www.openstreetmap.org/directions?to=${mawaqit?.latitude ?? ""}%2C${mawaqit?.longitude ?? ""}`}
            variant="primary"
            className="mt-6"
          >
            {t("heading")}
          </Button>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="aspect-video overflow-hidden rounded-2xl">
            {mawaqit ? (
              <ClickToLoadMap
                latitude={mawaqit.latitude}
                longitude={mawaqit.longitude}
                label={siteSettings.address || "An-Nur Moschee"}
                loadLabel={t("loadMap")}
              />
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
