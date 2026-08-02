import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLatestNews } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Button } from "@/components/ui/Button";

export async function NewsTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("news");
  const news = await getLatestNews(locale, 3);

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-mosque-green-dark sm:text-4xl">{t("heading")}</h2>
            <Button href="/aktuelles" variant="ghost">
              {t("heading")}
            </Button>
          </div>
        </Reveal>

        {news.length === 0 ? (
          <Reveal delay={0.1}>
            <p className="mt-6 rounded-2xl bg-sage/60 p-8 text-center text-charcoal/70">{t("empty")}</p>
          </Reveal>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {news.map((article, i) => (
              <Reveal key={article.id} delay={i * 0.08}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-mosque-green/10 bg-white shadow-sm">
                  <PlaceholderImage label="ADD NEWS PHOTO" aspect="video" className="rounded-none border-0" />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="font-semibold text-mosque-green-dark">{article.title}</p>
                    {article.excerpt && <p className="mt-2 text-sm text-charcoal/70">{article.excerpt}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
