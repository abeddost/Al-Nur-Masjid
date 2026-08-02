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
    <section className="bg-sage/40 py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mosque-green">{t("heading")}</p>
              <h2 className="font-display mt-2 text-3xl font-semibold text-mosque-green-dark sm:text-4xl">
                {t("heading")}
              </h2>
            </div>
            <Button href="/aktuelles" variant="outline">
              {t("heading")}
            </Button>
          </div>
        </Reveal>

        {news.length === 0 ? (
          <Reveal delay={0.1}>
            <p className="mt-8 rounded-3xl bg-white p-10 text-center text-charcoal/70 shadow-sm">{t("empty")}</p>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {news.map((article, i) => (
              <Reveal key={article.id} delay={i * 0.08} className={i === 0 ? "lg:col-span-2" : undefined}>
                <article
                  className={`flex h-full overflow-hidden rounded-3xl border border-mosque-green/10 bg-white shadow-sm transition-shadow hover:shadow-lg ${
                    i === 0 ? "flex-col sm:flex-row" : "flex-col"
                  }`}
                >
                  <PlaceholderImage
                    label="ADD NEWS PHOTO"
                    aspect={i === 0 ? "wide" : "video"}
                    className={`rounded-none border-0 ${i === 0 ? "sm:w-1/2" : ""}`}
                  />
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <p className="font-display text-lg font-semibold text-mosque-green-dark">{article.title}</p>
                    {article.excerpt && <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{article.excerpt}</p>}
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
