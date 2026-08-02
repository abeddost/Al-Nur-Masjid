import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";

export async function AboutSection() {
  const t = await getTranslations("about");

  const links = [
    { href: "/unsere-moschee", label: t("linkMosque") },
    { href: "/unser-verein", label: t("linkAssociation") },
    { href: "/unser-verein#geschichte", label: t("linkHistory") },
    { href: "/mitgliedschaft", label: t("linkMembership") },
  ];

  return (
    <section className="relative py-20 sm:py-24">
      <div className="pattern-geometric absolute inset-0 opacity-[0.06]" aria-hidden="true" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mosque-green">An-Nur</p>
          <h2 className="font-display mt-3 text-3xl font-semibold leading-tight text-mosque-green-dark sm:text-4xl">
            {t("heading")}
          </h2>
          <span aria-hidden="true" className="mt-4 block h-[3px] w-14 rounded-full bg-gold" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-charcoal/80 sm:text-xl">{t("body")}</p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-mosque-green">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="underline-offset-4 hover:underline">
                {link.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
