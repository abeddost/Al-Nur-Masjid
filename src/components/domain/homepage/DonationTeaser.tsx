import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getActiveDonationCampaign } from "@/lib/payload/queries";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export async function DonationTeaser() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("donation");
  const campaign = await getActiveDonationCampaign(locale);

  if (!campaign) return null;

  const hasFigures = campaign.goalAmountCents != null && campaign.raisedAmountCents != null;
  const progress = hasFigures
    ? Math.min(100, Math.round(((campaign.raisedAmountCents as number) / (campaign.goalAmountCents as number)) * 100))
    : 0;

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-mosque-green p-8 text-ivory shadow-xl sm:p-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="pattern-geometric absolute inset-0 opacity-[0.07]" aria-hidden="true" />
          <Reveal className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t("heading")}</p>
            <h3 className="font-display mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{campaign.name}</h3>

            {hasFigures ? (
              <div className="mt-6">
                <div className="h-3 w-full overflow-hidden rounded-full bg-ivory/20">
                  <div
                    className="h-full rounded-full bg-gold transition-[width] duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-ivory/80">{progress}%</p>
              </div>
            ) : (
              <p className="mt-5 rounded-xl bg-ivory/10 px-4 py-3 text-sm text-ivory/85">{t("pendingFigures")}</p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/spenden" variant="secondary">
                {t("heading")}
              </Button>
              <Button href="/spenden#transparenz" variant="ghost" className="text-ivory hover:bg-ivory/10">
                {t("transparencyLink")}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="relative">
            <PlaceholderImage
              label="ADD DONATION CAMPAIGN PHOTO"
              aspect="video"
              className="border-ivory/30 bg-ivory/10 text-ivory"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
