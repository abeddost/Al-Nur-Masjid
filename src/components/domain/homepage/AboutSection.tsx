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
    <section className="pattern-geometric py-16 sm:py-20">
      <Container className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-3xl font-bold text-mosque-green-dark sm:text-4xl">{t("heading")}</h2>
          <p className="mt-4 text-lg leading-relaxed text-charcoal/80">{t("body")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-semibold text-mosque-green">
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
