import { getLocale, getTranslations } from "next-intl/server";
import * as Icons from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getServices } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";

const toPascalCase = (kebab: string) =>
  kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

export async function ServicesGrid() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("services");
  const services = await getServices(locale);

  if (services.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-24">
      <div className="pattern-geometric absolute inset-0 opacity-[0.05]" aria-hidden="true" />
      <Container className="relative">
        <Reveal>
          <SectionHeading heading={t("heading")} subheading={t("subheading")} />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const iconKey = service.icon ? toPascalCase(service.icon) : "Sparkles";
            const Icon = (Icons[iconKey as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Sparkles;
            return (
              <Reveal key={service.id} delay={i * 0.05}>
                <Link
                  href={service.linkHref || "/beratung-und-dienstleistung"}
                  className="group flex h-full flex-col rounded-3xl border border-mosque-green/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-mosque-green ring-4 ring-gold/15 transition-colors group-hover:bg-mosque-green group-hover:text-ivory">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="font-display mt-5 text-lg font-semibold text-mosque-green-dark">{service.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{service.description}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
