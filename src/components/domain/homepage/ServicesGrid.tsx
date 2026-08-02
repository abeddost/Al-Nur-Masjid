import { getLocale, getTranslations } from "next-intl/server";
import * as Icons from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { getServices } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
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
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-mosque-green-dark sm:text-4xl">{t("heading")}</h2>
            <p className="mt-2 text-charcoal/70">{t("subheading")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const iconKey = service.icon ? toPascalCase(service.icon) : "Sparkles";
            const Icon = (Icons[iconKey as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Sparkles;
            return (
              <Reveal key={service.id} delay={i * 0.05}>
                <Link
                  href={service.linkHref || "/beratung-und-dienstleistung"}
                  className="group flex h-full flex-col rounded-2xl border border-mosque-green/10 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-mosque-green">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-semibold text-mosque-green-dark">{service.title}</p>
                  <p className="mt-1.5 text-sm text-charcoal/70">{service.description}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
